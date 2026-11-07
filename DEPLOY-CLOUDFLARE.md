# 部署到 Cloudflare Pages（静态站）

这个目录本身就是完整的静态网站，不需要构建、不需要 Node。

```
sq-auth-public-site/
├── index.html           # 首页（文件名必须保持 index.html）
├── style.css            # 全站样式
├── script.js            # 交互脚本（原生 JS，无依赖）
├── theme-init.js        # 主题初始化（在样式应用前确定深浅模式，防止闪烁）
├── assets/              # 品牌资源（logo.svg / logo.png）
├── 404.html             # 404 兜底页
├── robots.txt           # 搜索引擎规则
├── sitemap.xml          # 站点地图（部署后替换域名）
└── _headers             # Cloudflare Pages 响应头（安全 + 缓存）
```

---

## 方式 A：Dashboard 直接上传（最快）

1. 登录 Cloudflare Dashboard → **Workers & Pages** → **Create application** → **Pages** → **Upload assets**。
2. 项目名填 `sq-auth`（或自定义），上传 `sq-auth-public-site` 整个文件夹（也可以先压缩成 zip 再上传）。
3. 上传完成后，Cloudflare 会给出 `https://<项目名>.pages.dev` 公网地址。
4. 之后更新：进入项目 → **Create new deployment** → 重新上传同一个文件夹即可。

## 方式 B：Wrangler 命令行

```bash
# 首次使用会打开浏览器登录 Cloudflare
npx wrangler pages project create sq-auth --production-branch main

# 部署（在 sq-auth-public-site 的上一级目录执行）
npx wrangler pages deploy ./sq-auth-public-site --project-name sq-auth
```

命令执行成功后会输出一个 `*.pages.dev` 地址。

## 绑定自定义域名

Pages 项目 → **Custom domains** → **Set up a domain** → 输入你的域名。

- 域名已托管在 Cloudflare：自动加 CNAME，等证书签发即可。
- 域名在别处：按提示到 DNS 服务商添加 Cloudflare 给出的 CNAME 记录。

绑定后把 `sitemap.xml` 里的 `https://example.pages.dev/` 换成你的真实域名。

---

## 上线前本地预览

```bash
# 任选一种静态服务器
python -m http.server 8080 --directory sq-auth-public-site
# 或
npx serve sq-auth-public-site
```

浏览器打开 `http://127.0.0.1:8080/` 检查桌面与手机宽度。

## 注意事项

- `index.html` 必须保持这个文件名，Cloudflare Pages 用它作为首页。
- 深浅主题由 `theme-init.js` + `localStorage` 控制，默认跟随系统 `prefers-color-scheme`。
- 资源全部使用相对路径（`./style.css`、`./assets/logo.svg`），部署到根域或子路径都能正常加载。
- `_headers` 返回安全响应头与缓存策略，Cloudflare Pages 会自动识别；不需要额外配置。
- `404.html` 会被 Cloudflare Pages 自动用作兜底页。
- 页面不加载任何第三方脚本、字体或统计代码，可直接通过 CSP；如需接入分析工具，记得同步修改 `_headers` 里的 `script-src` / `connect-src`。
