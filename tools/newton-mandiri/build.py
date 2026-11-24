import base64, json
b64=lambda p,m: f"data:{m};base64,"+base64.b64encode(open(p,'rb').read()).decode()
N='/home/claude/course/assets/nella/'
s=open('/home/claude/nw/newton.src.html').read()
s=s.replace('{{AVATAR}}',b64(N+'avatar.jpg','image/jpeg')).replace('{{BODY}}',b64(N+'body.webp','image/webp')).replace('{{HAND}}',b64(N+'hand.webp','image/webp'))
v={k:b64(f'/tmp/nw/{k}.m4a','audio/mp4') for k in ['greet','h1','h2','h3s','h3r','quiz']}
s=s.replace('{{VOICE}}',json.dumps(v))
open('/home/claude/nw/hukum-newton-bu-nella.html','w').write(s); print(len(s)//1024,'KB')
