我要把旧的 Hexo 博客项目迁移到当前 astro-theme-pure 项目。旧项目路径：windows文件系统下D:/Blog

请按以下步骤执行：

1. 先只读分析，不要动任何文件：
   - 读旧项目的 _config.yml，提取站点标题、描述、作者、社交链接、语言等配置
   - 读旧项目 source/_posts/ 下所有文章的 frontmatter 字段（date、tags、categories、cover 等），总结字段命名规律
   - 读旧项目 source/about/index.md（或类似 About 页面）
   - 读当前项目的 src/content.config.ts 或 content/config.ts，搞清楚 posts collection 的 schema 要求哪些字段
   - 读当前项目 astro.config.ts 里站点信息配置的位置

2. 给我一份迁移映射表，说明：
   - 旧 frontmatter 字段 -> 新 schema 字段的对应关系
   - 有哪些字段新 schema 没有、需要怎么处理（丢弃/改名/塞进 extra）
   - 站点级配置要改哪些文件

3. 我确认映射表没问题后，再实际执行：
   - 批量转换所有文章的 frontmatter 并复制正文到 src/content/posts/（保留原始 Markdown 正文不动，除非有 Hexo 专属标签语法需要转换，比如 {% asset_img %} 这类要提醒我）
   - 迁移 About 页面
   - 更新站点配置

4. 迁移完成后跑一次 bun dev 或 astro check，把报错列出来给我看