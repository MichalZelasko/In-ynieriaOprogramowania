#/bin/bash

scripts_dir=$(pwd)
icon_dir="${scripts_dir}/../resources/graphics/icon_datahub.png"
exe_dir="${scripts_dir}/run.sh"
file=/home/$USERNAME/.local/share/applications/DATAHUB.desktop
file_usr=/usr/share/applications/DATAHUB.desktop

create_desktop_entry() {
    touch /home/$USERNAME/.local/share/applications/DATAHUB.desktop
    echo "[Desktop Entry]" >> /home/$USERNAME/.local/share/applications/DATAHUB.desktop
    echo "Encoding=UTF-8" >> /home/$USERNAME/.local/share/applications/DATAHUB.desktop
    echo "Name=DATAHUB-IO" >> /home/$USERNAME/.local/share/applications/DATAHUB.desktop
    echo "Icon=${icon_dir}" >> /home/$USERNAME/.local/share/applications/DATAHUB.desktop
    echo "Path=${scripts_dir}" >> /home/$USERNAME/.local/share/applications/DATAHUB.desktop
    echo "Exec=${exe_dir}" >> /home/$USERNAME/.local/share/applications/DATAHUB.desktop
    echo "Type=Application" >> /home/$USERNAME/.local/share/applications/DATAHUB.desktop
    echo "Terminal=false" >> /home/$USERNAME/.local/share/applications/DATAHUB.desktop
}

create_desktop_entry_usr() {
    sudo touch /usr/share/applications/DATAHUB.desktop
    sudo chmod 777 /usr/share/applications/DATAHUB.desktop
    echo "[Desktop Entry]" >> /usr/share/applications/DATAHUB.desktop
    echo "Name=DATAHUB-IO" >> /usr/share/applications/DATAHUB.desktop
    echo "Icon=${icon_dir}" >> /usr/share/applications/DATAHUB.desktop
    echo "Path=${scripts_dir}" >> /usr/share/applications/DATAHUB.desktop
    echo "Exec=${exe_dir}" >> /usr/share/applications/DATAHUB.desktop
    echo "Type=Application" >> /usr/share/applications/DATAHUB.desktop
    echo "Terminal=false" >> /usr/share/applications/DATAHUB.desktop
}

create_desktop_entry
sudo chmod +x $file
#sudo chmod +x $file

#if [ -f "$file" ]; then
#    whiptail --backtitle "DATAHUB-IO INSTALLER" --title "Info" --ok-button "ok" "Aplikacja jest już zainstalowana." 25 80
#else
#    if [ "$(id -nu)" != "root" ]; then
#        sudo -k
#        pass=$(whiptail --backtitle "DATAHUB-IO INSTALLER" --title "Wymagana autoryzacja" --passwordbox "Instalacja DATAHUB-IO wymaga uprawnień administratora. Podaj hasło aby kontynuować.\n\n[sudo] Hasło użytkownika $USER:" 12 50 3>&2 2>&1 1>&3-)
#        if [ sudo -S <<< "$pass" echo "correct" == "" ];
#        create_desktop_entry
#        sudo -S <<< "$pass" chmod +x $file
#    else
#        create_desktop_entry
#        sudo chmod +x $file
#    fi
#fi

#exit 1

