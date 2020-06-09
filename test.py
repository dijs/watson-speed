import speedtest   
import os
import requests

servers =[]   

# bps to Mbps
mbs = 1024 * 1024 / 8 * 8

st = speedtest.Speedtest() 

st.get_servers(servers)
download = st.download() / mbs
upload = st.upload() / mbs
ping = st.results.ping
room = os.getenv('ROOM', 'none')
host = os.getenv('HOST')

r = requests.get("{}/api/log?room={}&download={}&upload={}&ping={}".format(host, room, download, upload, ping))

print(room, download, upload, ping)