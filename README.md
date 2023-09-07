## 项目介绍

这是一个工具合集，个人在以往项目中实现过的业务或者个人写的一些小功能集中起来

## 项目结构

```ini
  DIR:yys-cuter-client2                         #
   |-- build/                                 # 「build」
   |-- notarize.js                            #
   |-- icon.png                               #
   |-- icon.ico                               #
   |-- icon.icns                              #
   `-- entitlements.mac.plist                 #
   |-- resources/                             # 「resources」 静态资源，会被复制
   `-- icon.png                               #
   |-- src/                                   # 「src」
   |-- main/                                  # 「main」 【主进程-源码】
   |   |-- window.ts                          #
   |   |-- utils.ts                           #
   |   |-- logger.ts                          #
   |   |-- index.ts                           #
   |   |-- event.ts                           #
   |   `-- config.ts                          #
   |-- preload/                               # 「preload」【通讯进程-源码】
   |   |-- index.ts                           #
   |   |-- index.d.ts                         #
   |   `-- .cz-config.js                      #
   |-- renderer/                              # 「renderer」 【UI-渲染进程-源码】
   |   |-- public/                            # 「public」静态资源，会被打包
   |   |   |-- speed_template.png             #
   |   |   |-- points_template.png            #
   |   |   |-- mimi.png                       #
   |   |   `-- dir_template.png               #
   |   |-- src/                               # 「src」 【UI-源码】
   |   |   |-- assets/                        # 「assets」常用资源
   |   |   |   |-- icons/                     # 「icons」 图标
   |   |   |   |   `-- iconfont.js            #
   |   |   |-- components/                    # 「components」 一些全局使用的组件
   |   |   |   |-- global/                    # 「global」
   |   |   |   |   |-- headLessDialog.vue     #
   |   |   |   |   `-- cpsButton.vue          #
   |   |   |   |-- settings.vue               #
   |   |   |   `-- cpsIconFont.vue            #
   |   |   |-- layout/                        # 「layout」基础布局
   |   |   |   |-- aside/                     # 「aside」 侧边栏
   |   |   |   |   |-- index.vue              #
   |   |   |   |   |-- asideSplitLine.vue     #
   |   |   |   |   `-- asideMenuItem.vue      #
   |   |   |   `-- index.vue                  #
   |   |   |-- libs/                          # 「libs」
   |   |   |   |-- index.ts                   #  加载器
   |   |   |   |-- eventBusMain.ts            #  事件中心-所有与主进程通讯的事件都在这里注册
   |   |   |   `-- eventBus.ts                #  事件中心-所有渲染进程的事件都在这里注册
   |   |   |-- router/                        # 「router」
   |   |   |   `-- index.ts                   #
   |   |   |-- stores/                        # 「stores」
   |   |   |   `-- index.ts                   #
   |   |   |-- utils/                         # 「utils」 工具类
   |   |   |   |-- tools.ts                   #
   |   |   |   |-- mime-type.ts               #
   |   |   |   |-- Intersect.ts               #
   |   |   |   |-- imgSizeReader.ts           #
   |   |   |   |-- imgHandler.ts              #
   |   |   |   |-- element.ts                 #
   |   |   |   `-- cpsColor.ts                #
   |   |   |-- views/                         # 「views」 每个子文件夹都代表一个页面，同时也是一个独立的组件，可被其他项目直接使用
   |   |   |   |-- GisApi/                    # 「GisApi」
   |   |   |   |   |-- body/                  # 「body」
   |   |   |   |   |   |-- SwiperSetp4.vue    #
   |   |   |   |   |   |-- SwiperSetp3.vue    #
   |   |   |   |   |   |-- SwiperSetp2.vue    #
   |   |   |   |   |   |-- SwiperSetp1.vue    #
   |   |   |   |   |   |-- index.vue          #
   |   |   |   |   |   `-- content.vue        #
   |   |   |   |   |-- store/                 # 「store」
   |   |   |   |   |   |-- state.ts           #
   |   |   |   |   |   |-- data.ts            #
   |   |   |   |   |   |-- config.ts          #
   |   |   |   |   |   `-- api.ts             #
   |   |   |   |   |-- index.vue              #
   |   |   |   |   |-- index.stylus           #
   |   |   |   |   |-- header.vue             #
   |   |   |   |   `-- event.ts               #
   |   |   |   |-- GisApi_old/                # 「GisApi_old」 已弃用
   |   |   |   |   |-- index.vue              #
   |   |   |   |   |-- header.vue             #
   |   |   |   |   |-- data.ts                #
   |   |   |   |   |-- body.vue               #
   |   |   |   |   `-- api.ts                 #
   |   |   |   |-- Home/                      # 「Home」
   |   |   |   |   `-- index.vue              #
   |   |   |   |-- ImageCuter/                # 「ImageCuter」
   |   |   |   |   |-- body/                  # 「body」
   |   |   |   |   |   |-- toolsMenus.vue     #
   |   |   |   |   |   |-- toolsBar.vue       #
   |   |   |   |   |   |-- pageServices.vue   #
   |   |   |   |   |   |-- pageSelectron.vue  #
   |   |   |   |   |   |-- pageHistory.vue    #
   |   |   |   |   |   |-- pageDataEditor.vue #
   |   |   |   |   |   |-- index.vue          #
   |   |   |   |   |   |-- dragResize_old.vue #
   |   |   |   |   |   `-- dragResize.vue     #
   |   |   |   |   |-- config/                # 「config」
   |   |   |   |   |   |-- panelServer.vue    #
   |   |   |   |   |   |-- panelScreen.vue    #
   |   |   |   |   |   |-- panelImage.vue     #
   |   |   |   |   |   |-- panelGeneral.vue   #
   |   |   |   |   |   |-- index.vue          #
   |   |   |   |   |   `-- exeConfig.ts       #
   |   |   |   |   |-- core/                  # 「core」
   |   |   |   |   |   |-- server.ts          #
   |   |   |   |   |   |-- index.ts           #
   |   |   |   |   |   `-- api.ts             #
   |   |   |   |   |-- footer/                # 「footer」
   |   |   |   |   |   |-- tabCropPanel/      # 「tabCropPanel」
   |   |   |   |   |   |   |-- index.vue      #
   |   |   |   |   |   |   `-- cropInput.vue  #
   |   |   |   |   |   |-- tabServerPanel.vue #
   |   |   |   |   |   |-- tabSelection.vue   #
   |   |   |   |   |   |-- tabPictureInfo.vue #
   |   |   |   |   |   `-- index.vue          #
   |   |   |   |   |-- header/                # 「header」
   |   |   |   |   |   `-- index.vue          #
   |   |   |   |   |-- store/                 # 「store」
   |   |   |   |   |   |-- state.ts           #
   |   |   |   |   |   |-- server.ts          #
   |   |   |   |   |   |-- menus.ts           #
   |   |   |   |   |   |-- jsonData.ts        #
   |   |   |   |   |   |-- index.ts           #
   |   |   |   |   |   |-- data.ts            #
   |   |   |   |   |   `-- config.ts          #
   |   |   |   |   |-- index.vue              #
   |   |   |   |   |-- imageCuter.d.ts        #
   |   |   |   |   `-- events.ts              #
   |   |   |-- tailwindCSS.css                #
   |   |   |-- main.ts                        #
   |   |   |-- global.d.ts                    #
   |   |   |-- env.d.ts                       #
   |   |   `-- App.vue                        #
   |   |-- index_old.html                     #
   |   |-- index_bk.html                      #
   |   `-- index.html                         #
   |-- types/                                 # 「types」
   |   |-- global.ts                          #  全局类型，一些主进程和渲染进程会公用到的类型
   |   |-- auto-imports.d.ts                  #
   |   `-- auto-components.d.ts               #
   `-- TODO.md                                #
   |-- tsconfig.web.json                      #
   |-- tsconfig.node.json                     #
   |-- tsconfig.json                          #
   |-- tailwind.config.js                     #
   |-- README.md                              #
   |-- prettier.config.cjs                    #
   |-- postcss.config.js                      #
   |-- pnpm-lock.yaml                         #
   |-- package.json                           #
   |-- electron.vite.config.ts                #
   |-- electron-builder.yml                   #
   |-- dev.bat                                #
   |-- dev-app-update.yml                     #
   |-- commitlint.config.js                   #
   |-- .prettierignore                        #
   |-- .npmrc                                 #
   |-- .hintrc                                #
   |-- .gitignore                             #
   |-- .eslintrc.cjs                          #
   |-- .eslintignore                          #
   |-- .editorconfig                          #
   `-- .cz-config.js                          #

```
