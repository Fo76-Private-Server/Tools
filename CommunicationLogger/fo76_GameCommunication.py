from __future__ import print_function
from pathlib import Path
import frida
import sys
import logging

def on_message(message, data):
    print("[%s] => %s" % (message, data))
    logging.warning(message['payload'] + ' - ' + data.hex());

def main(target_process):
    logging.basicConfig(filename='fo76.log', filemode='w', format='%(message)s')
    session = frida.attach(target_process)
    contents = Path('fo76_GameCommunication.js').read_text()
    script = session.create_script(contents)
    script.on('message', on_message)
    script.load()
    print("[!] Ctrl+D on UNIX, Ctrl+Z on Windows/cmd.exe to detach from instrumented program.\n\n")
    sys.stdin.read()
    session.detach()

if __name__ == '__main__':
    target_process = 'Fallout76.exe'
    main(target_process)