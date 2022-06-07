"""Provide access to Python's configuration information.  The specific
configuration variables available depend heavily on the platform and
configuration.  The values may be retrieved using
get_config_var(name), and the list of variables is available via
get_config_vars().keys().  Additional convenience functions are also
available.

Written by:   Fred L. Drake, Jr.
Email:        <fdrake@acm.org>
"""

import _imp
import os
import re
import sys
import warnings
import fnmatch

from functools import partial

from .errors import DistutilsPlatformError

from sysconfig import (
    _PREFIX as PREFIX,
    _BASE_PREFIX as BASE_PREFIX,
    _EXEC_PREFIX as EXEC_PREFIX,
    _BASE_EXEC_PREFIX as BASE_EXEC_PREFIX,
    _PROJECT_BASE as project_base,
    _PYTHON_BUILD as python_build,
    _init_posix as sysconfig_init_posix,
    parse_config_h as sysconfig_parse_config_h,
    _parse_makefile as sysconfig_parse_makefile,

    _init_non_posix,
    _is_python_source_dir,
    _sys_home,

    _variable_rx,
    _findvar1_rx,
    _findvar2_rx,

    expand_makefile_vars,
    is_python_build,
    get_config_h_filename,
    get_config_var,
    get_config_vars,
    get_makefile_filename,
    get_python_version,
)

# This is better than
# from sysconfig import _CONFIG_VARS as _config_vars
# because it makes sure that the global dictionary is initialized
# which might not be true in the time of import.
_config_vars = get_config_vars()

if os.name == "nt":
    from sysconfig import _fix_pcbuild

warnings.warn(
    'The distutils.sysconfig module is deprecated, use sysconfig instead',
    DeprecationWarning,
    stacklevel=2
)


# Following functions are the same as in sysconfig but with different API
def parse_config_h(fp, g=None):
    return sysconfig_parse_config_h(fp, vars=g)


def parse_makefile(fn, g=None):
    return sysconfig_parse_makefile(fn, vars=g, keep_unresolved=False)

_python_build = partial(is_python_build, check_home=True)
_init_posix = partial(sysconfig_init_posix, _config_vars)
_init_nt = partial(_init_non_posix, _config_vars)


# Following functions are deprecated together with this module and they
# have no direct replacement

# Calculate the build qualifier flags if they are defined.  Adding the flags
# to the include and lib directories only makes sense for an installation, not
# an in-source build.
build_flags = ''
try:
    if not python_build:
        build_flags = sys.abiflags
except AttributeError:
    # It's not a configure-based build, so the sys module doesn't have
    # this attribute, which is fine.
    pass


def customize_compiler(compiler):
    """Do any platform-specific customization of a CCompiler instance.

    Mainly needed on Unix, so we can plug in the information that
    varies across Unices and is stored in Python's Makefile.
    """
    if compiler.compiler_type == "unix":
        if sys.platform == "darwin":
            # Perform first-time customization of compiler-related
            # config vars on OS X now that we know we need a compiler.
            # This is primarily to support Pythons from binary
            # installers.  The kind and paths to build tools on
            # the user system may vary significantly from the system
            # that Python itself was built on.  Also the user OS
            # version and build tools may not support the same set
            # of CPU architectures for universal builds.
            if not _config_vars.get('CUSTOMIZED_OSX_COMPILER'):
                import _osx_support
                _osx_support.customize_compiler(_config_vars)
                _config_vars['CUSTOMIZED_OSX_COMPILER'] = 'True'

        (cc, cxx, cflags, ccshared, ldshared, shlib_suffix, ar, ar_flags,
         configure_cppflags, configure_cflags, configure_ldflags) = \
            get_config_vars('CC', 'CXX', 'CFLAGS',
                            'CCSHARED', 'LDSHARED', 'SHLIB_SUFFIX', 'AR', 'ARFLAGS',
                            'CONFIGURE_CPPFLAGS', 'CONFIGURE_CFLAGS', 'CONFIGURE_LDFLAGS')

        if 'CC' in os.environ:
            newcc = os.environ['CC']
            if (sys.platform == 'darwin'
                    and 'LDSHARED' not in os.environ
                    and ldshared.startswith(cc)):
                # On OS X, if CC is overridden, use that as the default
                #       command for LDSHARED as well
                ldshared = newcc + ldshared[len(cc):]
            cc = newcc
        if 'CXX' in os.environ:
            cxx = os.environ['CXX']
        if fnmatch.filter([cc, cxx], '*-4.[0-8]'):
            configure_cflags = configure_cflags.replace('-fstack-protector-strong', '-fstack-protector')
            ldshared = ldshared.replace('-fstack-protector-strong', '-fstack-protector')
            cflags = cflags.replace('-fstack-protector-strong', '-fstack-protector')
        if 'LDSHARED' in os.environ:
            ldshared = os.environ['LDSHARED']
        if 'CPP' in os.environ:
            cpp = os.environ['CPP']
        else:
            cpp = cc + " -E"           # not always
        if 'LDFLAGS' in os.environ:
            ldshared = ldshared + ' ' + os.environ['LDFLAGS']
        elif configure_ldflags:
            ldshared = ldshared + ' ' + configure_ldflags
        if 'CFLAGS' in os.environ:
            cflags = cflags + ' ' + os.environ['CFLAGS']
            ldshared = ldshared + ' ' + os.environ['CFLAGS']
        elif configure_cflags:
            cflags = cflags + ' ' + configure_cflags
            ldshared = ldshared + ' ' + configure_cflags
        if 'CPPFLAGS' in os.environ:
            cpp = cpp + ' ' + os.environ['CPPFLAGS']
            cflags = cflags + ' ' + os.environ['CPPFLAGS']
            ldshared = ldshared + ' ' + os.environ['CPPFLAGS']
        elif configure_cppflags:
            cpp = cpp + ' ' + configure_cppflags
            cflags = cflags + ' ' + configure_cppflags
            ldshared = ldshared + ' ' + configure_cppflags
        if 'AR' in os.environ:
            ar = os.environ['AR']
        if 'ARFLAGS' in os.environ:
            archiver = ar + ' ' + os.environ['ARFLAGS']
        else:
            archiver = ar + ' ' + ar_flags

        cc_cmd = cc + ' ' + cflags
        compiler.set_executables(
            preprocessor=cpp,
            compiler=cc_cmd,
            compiler_so=cc_cmd + ' ' + ccshared,
            compiler_cxx=cxx,
            linker_so=ldshared,
            linker_exe=cc,
            archiver=archiver)

        compiler.shared_lib_extension = shlib_suffix


def get_python_inc(plat_specific=0, prefix=None):
    """Return the directory containing installed Python header files.

    If 'plat_specific' is false (the default), this is the path to the
    non-platform-specific header files, i.e. Python.h and so on;
    otherwise, this is the path to platform-specific header files
    (namely pyconfig.h).

    If 'prefix' is supplied, use it instead of sys.base_prefix or
    sys.base_exec_prefix -- i.e., ignore 'plat_specific'.
    """
    if prefix is None:
        prefix = plat_specific and BASE_EXEC_PREFIX or BASE_PREFIX
    if os.name == "posix":
        if python_build:
            # Assume the executable is in the build directory.  The
            # pyconfig.h file should be in the same directory.  Since
            # the build directory may not be the source directory, we
            # must use "srcdir" from the makefile to find the "Include"
            # directory.
            if plat_specific:
                return _sys_home or project_base
            else:
                incdir = os.path.join(get_config_var('srcdir'), 'Include')
                return os.path.normpath(incdir)
        python_dir = 'python' + get_python_version() + build_flags
        if not python_build and plat_specific:
            import sysconfig
            return sysconfig.get_path('platinclude')
        return os.path.join(prefix, "include", python_dir)
    elif os.name == "nt":
        if python_build:
            # Include both the include and PC dir to ensure we can find
            # pyconfig.h
            return (os.path.join(prefix, "include") + os.path.pathsep +
                    os.path.join(prefix, "PC"))
        return os.path.join(prefix, "include")
    else:
        raise DistutilsPlatformError(
            "I don't know where Python installs its C header files "
            "on platform '%s'" % os.name)


def get_python_lib(plat_specific=0, standard_lib=0, prefix=None):
    """Return the directory containing the Python library (standard or
    site additions).

    If 'plat_specific' is true, return the directory containing
    platform-specific modules, i.e. any module from a non-pure-Python
    module distribution; otherwise, return the platform-shared library
    directory.  If 'standard_lib' is true, return the directory
    containing standard Python library modules; otherwise, return the
    directory for site-specific modules.

    If 'prefix' is supplied, use it instead of sys.base_prefix or
    sys.base_exec_prefix -- i.e., ignore 'plat_specific'.
    """
    is_default_prefix = not prefix or os.path.normpath(prefix) in ('/usr', '/usr/local')
    if prefix is None:
        if standard_lib:
            prefix = plat_specific and BASE_EXEC_PREFIX or BASE_PREFIX
        else:
            prefix = plat_specific and EXEC_PREFIX or PREFIX

    if os.name == "posix":
        if plat_specific or standard_lib:
            # Platform-specific modules (any module from a non-pure-Python
            # module distribution) or standard Python library modules.
            libdir = sys.platlibdir
        else:
            # Pure Python
            libdir = "lib"
        libpython = os.path.join(prefix, libdir,
                                 "python" + get_python_version())
        if standard_lib:
            return libpython
        elif (is_default_prefix and
              'PYTHONUSERBASE' not in os.environ and
              'VIRTUAL_ENV' not in os.environ and
              'real_prefix' not in sys.__dict__ and
              sys.prefix == sys.base_prefix):
            return os.path.join(prefix, "lib", "python3", "dist-packages")
        else:
            return os.path.join(libpython, "site-packages")
    elif os.name == "nt":
        if standard_lib:
            return os.path.join(prefix, "Lib")
        else:
            return os.path.join(prefix, "Lib", "site-packages")
    else:
        raise DistutilsPlatformError(
            "I don't know where Python installs its library "
            "on platform '%s'" % os.name)