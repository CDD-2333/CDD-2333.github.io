---
title: Small Tool 1
publishDate: 2026-05-02 08:13:33
description: A small tool to check if your waitlist has been redeemed, currently supporting qq/netease emails.
tags: []
---
12306 waitlist check tool v1.1.0  
A small tool to check if your waitlist has been redeemed, currently supporting qq/netease emails.  
Last edited on 2026/02/08, coded in python 3.14.2  
[Click here to download](https://github.com/CDD-2333/CDD-2333.github.io/releases/download/v1.1.0/query.exe)  

## Source Code
```python
import imaplib
import email
from email.header import decode_header
import time
import os
import winsound
import json
import keyboard
from ctypes import cast,POINTER
from comtypes import CLSCTX_ALL
from pycaw.pycaw import AudioUtilities,IAudioEndpointVolume

IMAP_SERVER = ""
EMAIL_USER=""
EMAIL_PASS=""
CHECK_INTERVAL=60
CONFIG_FILE="config.json"

def exit_program():
    print("[系统] 正在退出程序，欢迎下次使用！")
    time.sleep(3)
    os._exit(0)

def set_system_volume(level):
    try:
        devices=AudioUtilities.GetSpeakers()
        interface=devices.Activate(IAudioEndpointVolume._iid_,CLSCTX_ALL,None)
        volume=cast(interface,POINTER(IAudioEndpointVolume))
        volume.SetMasterVolumeLevelScalar(level,None)
    except Exception as e:
        print(f"[Error] 音量调节失败: {e}")

def validate_login(user,password,server):
    try:
        mail=imaplib.IMAP4_SSL(server)
        mail.login(user,password)
        mail.logout()
        return True
    except Exception:
        return False

def get_config():
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE,"r") as f:
            return json.load(f)
        
    print("12306候补邮件检查 v1.1.0 by Coderdiao\n")
    print("欢迎！这是您的首次使用，请配置您的邮箱信息：")
    while(1):
        email=input("请输入邮箱地址：").strip()
        pass_code=input("请输入邮箱授权码：").strip()
        server="imap.163.com"
        if "qq.com" in email.lower():
            server="imap.qq.com"
        print(f"[系统] 正在尝试登录...")
        if validate_login(email,pass_code,server):
            print("[系统] 登录成功！已保存您的用户信息至本地")
            config={"email":email,"pass":pass_code,"server":server}
            with open(CONFIG_FILE,"w") as f:
                json.dump(config,f)
            return config
        else:
            print("\a[Error] 登录失败！请检查您的账号或授权码，确认邮箱是否已开启IMAP服务！\n")

def play_alert():
    set_system_volume(0.6)

    print("\a")
    for i in range(10):
        winsound.MessageBeep(winsound.MB_ICONHAND)
        time.sleep(0.5)
    #winsound.PlaySound("alert.wav",winsound.SND_FILENAME)

def check_tickets():
    mail=None
    try:
        mail=imaplib.IMAP4_SSL(IMAP_SERVER)
        mail.login(EMAIL_USER,EMAIL_PASS)

        try:
            imaplib.Commands['ID']=('AUTH')
            mail._simple_command('ID','("name" "Monitor by Coderdiao" "version" "1.1.0" "vendor" "local")')
        except:pass

        mail.select("INBOX")
        search_query='(UNSEEN FROM "12306@rails.com.cn")'
        status,messages=mail.search(None, search_query)

        if status=="OK" and messages[0]:
            mail_ids=messages[0].split()
            for mail_id in reversed(mail_ids):
                res,msg_data=mail.fetch(mail_id,"(RFC822)")
                for response_part in msg_data:
                    if isinstance(response_part,tuple):
                        msg=email.message_from_bytes(response_part[1])

                        from_address=email.utils.parseaddr(msg.get("From"))[1]
                        if from_address.lower()!="12306@rails.com.cn":
                            continue

                        subject_raw=msg.get("Subject")
                        if subject_raw:
                            decoded=decode_header(subject_raw)[0]
                            subject=decoded[0]
                            if isinstance(subject,bytes):
                                subject=subject.decode(decoded[1] if decoded[1] else "utf-8")

                            print(f"[{time.strftime('%H:%M:%S')}] 扫描到邮件: {subject}")

                            if "成功" in subject and ("候补" in subject or "兑现" in subject):
                                return True
                        
    except Exception as e:
        print(f"[Error] 发生错误，请检查网络连接！若错误持续，请联系开发者: {e}")
    finally:
        if mail:
            try:mail.logout()
            except:pass
    return False

if __name__=="__main__":
    config=get_config()
    EMAIL_USER=config["email"]
    EMAIL_PASS=config["pass"]
    IMAP_SERVER=config["server"]

    keyboard.add_hotkey('ctrl+alt+p',exit_program)

    print("="*40)
    print("   12306候补邮件检查程序 v1.0.0 by Coderdiao")
    print("="*40)
    print(f"检查账号:{EMAIL_USER}")
    print(f"若退出程序，可使用快捷键：Ctrl+Alt+P")
    print("状态：运行中...")

    try:
        while(1):
            if check_tickets():
                print("\n"+"!"*20)
                print("!!!候补成功兑现!!!")
                print("!"*20+"\n")
                play_alert()
                break
            else:
                print(f"[{time.strftime('%H:%M:%S')}] 持续检查中...")
            time.sleep(CHECK_INTERVAL)
    except KeyboardInterrupt:
        print("[系统] 正在退出程序，欢迎下次使用！")
        time.sleep(2)
        os._exit(0)

    os.system("pause")
```
