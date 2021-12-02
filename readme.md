# What's this ?

This is a useful migration tool for migrating articles from [Kibela](https://kibe.la/) to [Notion](https://www.notion.so/product?fredir=1)

![Kibela archive: sample](https://i.gyazo.com/d0fc3c24bda1aca74b7feef40e5f8662.png)


# How to use it ?

1. export all Kibela file (needs a owner privilege)
   - FYI: [Exporting Notes](https://support.kibe.la/hc/ja/articles/360035421751)
1. move all Kibela exported notes to this project root.
   - e.g. `$ mv ~/Download/kibela-*-{n}/ ~/Documents/kibela-to-notion/`
1. set each props on Notion Database you want to import. sample is [here](https://learned-garment-070.notion.site/5c358395c87344dfb71a8ed0023c3298?v=a7ae5523d3474bc3897af676a7b3071f). if you want to change prop name, also rename `src/Config.ts` Notion.Props.\*.
   - Author: `Select Type`
   - Contributors: `Multi Select Type`
   - Folders: `Multi Select Type`
   - Groups: `Multi Select Type`
   - Comments: `Text`
   - PublishedAt: `Date`
   - UpdatedAt: `Date`
1. create a integration from here [Getting started](https://developers.notion.com/docs/getting-started). memo a secret value.
1. `$ cp _env .env` and fill env value
1. You can select S3 or Google Drive as the image storage destination
1. `$ yarn start`

# Caution

This tool was created when Notion API ver `2021-05-13` was released.
You can't upload images, you can't add comments to pages, and so on. (That's why I set the property "comments")
There are many limitations.

# Storage Security

Kibela's export data exports images and markdowns separately
And images in the text are specified as relative paths


![](https://i.gyazo.com/9badb7575781fd63ab681ce8da88b739.png)

e.g. `1-hoge.md` inline image

```markdown

## about hoge

<img title='hoge-1.jpg' src='../attachments/10.jpg' width="500" data-meta='{"width":500,"height":471}'>
```


Currently (2021/12/02), Notion does not support images with relative paths in the text as import targets.
The image in the statement must be an external URL.
Therefore, this project proposes two solutions

1. Upload all the images to S3, and make the images public with a random URL, so that end users cannot access the images without knowing the unguessable URL itself. This will result in an inline preview of the image when you import the article into Notion

1. use Google Drive and store all images in a folder in Drive. The permissions are set so that only those who know the Drive URL and those who have been granted permissions on the folder side can view the images. The images imported into Notion cannot be previewed inline. You need to step through the link and view it on the Drive side. However, it is secure.
