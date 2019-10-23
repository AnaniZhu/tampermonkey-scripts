// ==UserScript==
// @name         AnnaniZhu's script
// @namespace    https://github.com/AnaniZhu/tampermonkey-scripts
// @version      0.1.0
// @description  优化部分网页(node 文档 api 导航固定、掘金文章目录固定...)的交互体验
// @author       AnnaniZhu
// @license      MIT
// @create       2019-10-23
// @home-url     https://github.com/AnaniZhu/tampermonkey-scripts
// @run-at       document-idle
// @include      *://nodejs.cn/api/*
// @include      *://juejin.im/post/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  'use strict'
  /* eslint-disable-next-line */
  const { href: URL, host: HOST } = window.location

  const DOMAIN_SCRIPT_MAP = {
    'nodejs.cn': createNodeSideMenu,
    'juejin.im': fixeJueJindCategory
  }

  // 注入通用样式
  addCommonStyle()

  Object.keys(DOMAIN_SCRIPT_MAP).forEach(key => {
    if (new RegExp(key).test(HOST)) {
      DOMAIN_SCRIPT_MAP[key]()
    }
  })

  // node
  function createNodeSideMenu () {
    const sideMenu = document.createElement('div')
    const toggle = document.createElement('div')
    sideMenu.id = 'side_menu__nodejs'
    toggle.id = 'side_menu_toggle'
    const $toc = $('#toc')
    $toc.addClass('scroll-view')
    sideMenu.appendChild(toggle)
    sideMenu.appendChild($('#toc')[0])

    function toggleSideMenu () {
      $(sideMenu).toggleClass('open')
    }

    // 点击按钮或按 ESC 切换侧边栏显隐
    $(toggle).click(toggleSideMenu)
    $(document).keydown((e) => {
      if (e.key === 'Escape') {
        toggleSideMenu()
      }
    })

    GM_addStyle(`
      #side_menu__nodejs {
        position: fixed;
        top: 0;
        right: 0;
        width: 20%;
        min-width: 250px;
        transform: translateX(100%);
        transition: transform .15s;
      }

      #side_menu__nodejs.open {
        transform: translateX(0%);
      }

      #side_menu_toggle {
        position: absolute;
        left: -40px;
        top: 100px;
        padding: 20px;
        border-radius: 50%;
        color: #fff;
        background-color: rgba(113, 199, 173, 0.7);
        cursor: pointer;
        transform: translateX(-100%);
        transition: all 0.2s;
        animation: halo 2s 0s ease-out infinite;
      }

      @keyframes halo {
        0% {
          box-shadow: 0 0 2px 10px rgba(113, 199, 173, 0.7);
        }

        10% {
          box-shadow: 0 0 2px 10px rgb(113, 199, 173);
        }

        100% {
          box-shadow: 0 0 2px 40px rgba(113, 199, 173, 0.1);
        }
      }

      #toc {
        box-sizing: border-box;
        height: 100vh;
        padding: 16px 0 24px 0;
        overflow-y: auto;
        color: #fff;
        background-color: #333;
      }

      #toc h2,
      #toc url {
        margin: 0;
      }

      #toc h2 {
        font-size: 16px;
        text-align: center;
        margin-bottom: 8px;
      }

      #toc a {
        color: #ccc;
      }

      #toc a:hover {
        color: #fff;
      }
    `)

    document.body.appendChild(sideMenu)
  }

  // 掘金
  function fixeJueJindCategory () {
    // dom 延迟加载
    setTimeout(() => {
      $('.sticky-block-box').addClass('scroll-view')
    }, 300)
    GM_addStyle(`
    .scroll-view.sticky-block-box {
       position: fixed;
       left: 24px;
       top: 80px;
       bottom: 20px;
       width: 300px !important;
       margin: auto;
       z-index: 1000;
    }
    `)
  }

  function addCommonStyle () {
    GM_addStyle(`
    .scroll-view {
       overflow-y: auto;
    }
    .scroll-view::-webkit-scrollbar {
      width: 6px;
    }
    .scroll-view::-webkit-scrollbar-track {
      box-shadow:inset 0 0 6px rgba(0,0,0,0.3);
      border-radius: 10px;
    }
    .scroll-view::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: rgba(0,0,0,0.1);
      box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
    }
    .scroll-view::-webkit-scrollbar-thumb:window-inactive {
      background: rgba(255,0,0,0.4);
    }
    `)
  }
})()
