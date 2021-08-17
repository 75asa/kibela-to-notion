
# What's this ?

This is a useful migration tool for migrating articles from [Kibela](https://kibe.la/) to [Notion](https://www.notion.so/product?fredir=1)

# How to use it ?

1. export all Kibela file (needs a owner privilege)
   - FYI: [Exporting Notes](https://support.kibe.la/hc/ja/articles/360035421751)
1. `$ cp ${YOUR_DOWNLOADED_NOTE_DIR}/*.md notes/`
   - e.g. `$ cp ~/Downloads/kibela-archives/kibela-exported-4/notes/*.md notes/` executed by [fish](https://fishshell.com/)
1. set each props on Notion Database you want to import. sample is [here](https://learned-garment-070.notion.site/5c358395c87344dfb71a8ed0023c3298?v=a7ae5523d3474bc3897af676a7b3071f). if you want to change prop name, also rename `src/Config.ts` Notion.Props.*.
   - author: `Select Type`
   - contributors: `Multi Select Type`
   - folders: `Multi Select Type`
   - groups: `Multi Select Type`
   - comments: `Text`
1. `$ cp _env .env` and fill env value
1. create a integration from here [Getting started](https://developers.notion.com/docs/getting-started)
1. set env values
1. `$ yarn start`

# Caution

This tool was created when Notion API ver `2021-05-13` was released.
You can't upload images, you can't add comments to pages, and so on. (That's why I set the property "comments")
There are many limitations.
