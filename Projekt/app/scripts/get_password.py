import subprocess
import tkinter as tk
import tkinter.simpledialog
import tkinter.messagebox
from tkinter.messagebox import showerror, showwarning, showinfo


tk.Tk().withdraw()

password_message = "Podaj hasło: "

while True:
    password = tkinter.simpledialog.askstring("Wymagana autoryzacja", password_message, show="*")
    if password is None:
        tkinter.messagebox.showinfo("DATAHUB-IO", "Instalacja została przerwana.")
        print("Aborting...")
        exit(-1)

    check_sudo = f"echo \"{password}\" | timeout 1 sudo -S id && echo granted || echo denied"
    p = subprocess.Popen(check_sudo, shell=True, stdout=subprocess.PIPE)
    output = str(p.communicate()[0])
    if "granted" in output:
        break
    else:
        password_message = "Błędne hasło. Spróbuj jeszcze raz: "

# UWAGA
# skrypt szuka init.sh w katalogu z którego go odpalasz!
# czyli jeśli chcesz przetestować, to odpal tak
# subprocess.run(["sh", "./init.sh"])
# jak odpalasz przez install.sh to tak
subprocess.run(["sh", "./app/scripts/init.sh"])
tkinter.messagebox.showinfo("DATAHUB-IO", "Instalacja przebiegła pomyślnie")
