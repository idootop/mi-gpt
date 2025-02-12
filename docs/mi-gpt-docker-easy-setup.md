本教程将通过1Panel应用商店(Docekr)部署mi-gpt，全程简单易操作，后期一键迁移/备份，同时绕开了小米官方的异地登录风控

项目开源地址：https://github.com/idootop/mi-gpt
音箱支持列表：https://github.com/idootop/mi-gpt/blob/main/docs/compatibility.md

# 1.下载Docker Desktop到本地
[Docker Desktop 4.38原版](https://desktop.docker.com/win/main/amd64/181591/checksums.txt?_gl=1*l8glbc*_gcl_au*MTU2Mzg3OTg0NC4xNzM5MzQ3Mzg2*_ga*Njc1Mzg4NzkuMTczOTM0NzM4Nw..*_ga_XJWPQMJYHQ*MTczOTM0NzM4Ni4xLjEuMTczOTM0NzYwNi4yLjAuMA..) | [Docker Desktop 4.38汉化仓库](https://github.com/asxez/DockerDesktop-CN)
这里以汉化版为例，安装可能会要求重启一次，进入Docker Desktop后一路跳过出现这个页面就没问题了 
![image](https://github.com/user-attachments/assets/c57e3cf7-02b8-4168-8084-eea15def5cfa)


# 2.本地运行mi-gpt，提取JSON文件
**由于小米账号在异地登录需要频繁收取手机验证码，而且大部分情况下这是一个死循环，你永远无法通过这个验证，因此先从本地登录再将登录信息转移至服务器**
docker desktop找到容器栏-顶部搜索框搜索 mi-gpt ，找到 idootop/mi-gpt 拉取latest版本，拉取后点击运行并填写三条环境变量配置好gpt api方便测试

```
OPENAI_MODEL=e.g. gpt-4o-mini
OPENAI_API_KEY=YOUR_API_KEY
OPENAI_BASE_URL=YOUR_BASE_URL
```
**所有基于OpenAI SDK的API接口都能用，注意base_url截止到 /v1 并且结尾不要多余加斜杠**
这个时候就可以点击run运行了，有报错先别急，因为我们还没有配置登录信息
下面去 https://github.com/idootop/mi-gpt/blob/main/.migpt.example.js 下载 .migpt.example.js ，下载好后重命名为 .migpt.js 
**注意不要落下文件名开头的点** **不要落下文件名开头的点** **不要落下文件名开头的点** 重要的事情说三遍
之后使用任意工具编辑js，找到93-98行填写好小米账号以及小爱音箱did信息就好了，其他tts参数，大模型提示词之类的后期可以随意调整
修改好后保存到一个你熟悉的位置，之后右键开始菜单打开 power shell管理员，运行以下指令，替换你的js路径和docker id即可

```
docker cp "本机的.migpt.js存放路径" Docker ID:/app/.migpt.js
e.g. docker cp "E:/mi-gpt/.migpt.js" d92444226e00fda15204022bb791de9fd761cd7f2ebbc6ab962900219591e755:/app/.migpt.js

```
点击图中红框位置一键复制Docker ID
![image](https://github.com/user-attachments/assets/c1b76ccc-cc9b-4124-84ad-5a8d7e4a226d)

提示 Successfully copied 字样即为成功
![image](https://github.com/user-attachments/assets/152fe9e9-8bba-4e65-ae28-8d637b2549dc)

**此时请确保你已经断开所有代理，IP与小爱音箱处于同一地区，至少是同一城市，这是确保不触发风控的关键所在**，然后回到Docker Desktop，点击restart重启容器，等到出现提示 ✅ 服务已启动... 就代表正常运行起来了，此时可以尝试唤醒小爱并以“你”或“请”开头提问问题看看会不会有大模型介入，正常情况是会有的，如果报错大概率是你本地网咯到API或者API配置问题
确保出现 服务已启动 提示后回到Power Shell运行以下命令

```
docker cp Docker ID:/app/.mi.json 存放.mi.json的本机路径
e.g. docker cp d92444226e00fda15204022bb791de9fd761cd7f2ebbc6ab962900219591e755:/app/.mi.json D:/desktop
```
同样的出现 Successfully copied 字样代表成功，此时你就得到了 .mi.json 
这个操作几乎是一劳永逸的，只要你不变更音箱或小米账号他就是始终可用的

# 3.安装1Panel第三方应用商店
执行以下代码
```
git clone -b localApps https://github.com/okxlin/appstore /opt/1panel/resource/apps/local/appstore-localApps
cp -rf /opt/1panel/resource/apps/local/appstore-localApps/apps/* /opt/1panel/resource/apps/local/
rm -rf /opt/1panel/resource/apps/local/appstore-localApps
```

# 4.启动！
将你的 .migpt.js 和 .mi.json 存储到服务器，**注意1Panel和sftp终端在传输过程中可能会丢失文件名前的点，请注意时刻补充**
之后进入1Panel-应用商店右上角点击更新应用列表，此时就可以搜索到mi-gpt应用了，点击安装
下面正常填写接口信息，勾选编辑compose文件
例如我把文件全放在 /opt/mi-gpt 下，故将volumes修改成

```
- /opt/mi-gpt/.migpt.js:/app/.migpt.js
- /opt/mi-gpt/.mi.json:/app/.mi.json
```
最后点击确实安装，不出意外可以正常运行了  
如果需要修改tts参数，大模型提示词等自定义参数请去你存放在docker外部的文建去修改，修改好后回到应用商店点击重建即可

PS：非1Panel用户完全可以不通过应用商店安装，自己编辑compose文件运行即可
    若在中国大陆服务器部署可能不需要事先获取 .mi.json
    本地运行起来的也算成品，可以不进行后续步骤近依赖电脑
