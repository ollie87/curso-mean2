curso-mean2

Para que funcione en la máquina cliente ejecutar en el host (vagrant)
sudo iptables -I INPUT -p tcp --dport 10201 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 4200 -j ACCEPT 

Para arrancar la aplicación cliente
ng serve --host 10.100.1.10 

