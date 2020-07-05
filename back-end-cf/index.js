/**
 * IS_CN: 如果为世纪互联版本，请将 0 改为 1
 * EXPOSE_PATH：暴露路径，如全盘展示请留空，否则按 '/媒体/音乐' 的格式填写
 * ONEDRIVE_REFRESHTOKEN: refresh_token
 */
const IS_CN = 0
const EXPOSE_PATH = ""
const ONEDRIVE_REFRESHTOKEN = "OAQABAAAAAAAGV_bv21oQQ4ROqh0_1-tALVlw_DVOgpHw1tBYhbInvxRkhnTiF10fJBjSinl8g6fLne6HPnA8qUqXIJGTiVjOhUTANCl7ulemQGSFtH7kJSDDwadFTJup6g07FzSmMFpwRhWbEK0M5LTlCwZhOA_TXVWUP17pjuHLbi5OxDmVYzSue9Nw8iE3dcVeVT7m_tYlYdDUO29jnaw-L5J9JwKNXG7bIQNM90iETBTRZHcLo65jJ9zAmVkkxuxM54S-YLC2V924Oojk-5ri4AT5rilFCgK02kUhq57bnBGJW3Vq8GdKw6iB8_mIdIek8bOewhIPdGPnElxUTpOcIAwr4dZ5CMpO8YFp779yVP2yPh7WyXjI7W92iZKQ84c15E5E7NXLHjFYQOYpwHt2Fwe-DOWIWkEPUuqE6Iz6EB6IBtOR2OoYP53qsKVFCNTsacnMybvIIVtQ6wQfWOQHLoTkzWFbD5aaQ1QnRPqVcl3Q38JgYSnC_gGJaAx9q8MwpRfRi7aOAoAdEoRIKI7wrymvoSeYWReh7zT9nKwAtOv0RSTl6fJgpVJl0SdBlPr35GQKDJ-ZGQhT3iELqQJPqurEXy268Dq3m4vXr4v0bULW_LS1-HncsqMhdzuDnXXWjjCwQZD6xzcF0A2yiTFwlzSriBgNkk7PbgTwJAQPaS_wltg15PP1AOOLmmDNpf00T5OskyfaPOTaYztFDIgj0hjihXWtL2IAmufZi2-AHcep5biIduEGdMQ-Lq5_eT394powgPE7bQ26CDEGNAwityNdPEiAGUa766U6NKIW89qW0WLwtpynH7xjv0L49tx1WGr6oPHYaf2I1txXyqsPWMX7WpVefgrwR-dG9iNaoXRS4vCoQ6zXeN3Bc1mLgxG8x4yJmXhdObDrhpYY48qCnZPm0PRTQndjxGrCLSBnavhGT-GLYiAA"
const PASSWD_FILENAME = '.password'

async function handleRequest(request) {
  let querySplited, requestPath
  let queryString = decodeURIComponent(request.url.split('?')[1])
  if (queryString) querySplited = queryString.split('=')
  if (querySplited && querySplited[0] === 'file') {
    const file = querySplited[1]
    const fileName = file.split('/').pop()
    if (fileName === PASSWD_FILENAME)
      return Response.redirect('https://www.baidu.com/s?wd=%E6%80%8E%E6%A0%B7%E7%9B%97%E5%8F%96%E5%AF%86%E7%A0%81', 301)
    requestPath = file.replace('/' + fileName, '')
    const url = await fetchFiles(requestPath, fileName)
    return Response.redirect(url, 302)
  } else {
    const { headers } = request
    const contentType = headers.get('content-type')
    let body = {}
    if (contentType && contentType.includes('form')) {
      const formData = await request.formData()
      for (let entry of formData.entries()) {
        body[entry[0]] = entry[1]
      }
    }
    requestPath = Object.getOwnPropertyNames(body).length ? body['?path'] : ''
    const files = await fetchFiles(requestPath, null, body.passwd)
    return new Response(files, {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}

addEventListener('fetch', event => {
  return event.respondWith(handleRequest(event.request))
})


const clientId = [
  '4da3e7f2-bf6d-467c-aaf0-578078f0bf7c',
  '04c3ca0b-8d07-4773-85ad-98b037d25631'

]
const clientSecret = [
  '7/+ykq2xkfx:.DWjacuIRojIaaWL0QI6',
  'h8@B7kFVOmj0+8HKBWeNTgl@pU/z4yLB'
]

const oauthHost = [
  'https://login.microsoftonline.com',
  'https://login.partner.microsoftonline.cn'
]

const apiHost = [
  'https://graph.microsoft.com',
  'https://microsoftgraph.chinacloudapi.cn'
]

const OAUTH = {
  'redirectUri': 'https://scfonedrive.github.io',
  'refreshToken': ONEDRIVE_REFRESHTOKEN,
  'clientId': clientId[IS_CN],
  'clientSecret': clientSecret[IS_CN],
  'oauthUrl': oauthHost[IS_CN] + '/common/oauth2/v2.0/',
  'apiUrl': apiHost[IS_CN] + '/v1.0/me/drive/root',
  'scope': apiHost[IS_CN] + '/Files.ReadWrite.All offline_access'
}

async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get('content-type')
  if (contentType.includes('application/json')) {
    return await response.json()
  } else if (contentType.includes('application/text')) {
    return await response.text()
  } else if (contentType.includes('text/html')) {
    return await response.text()
  } else {
    return await response.text()
  }
}

async function getContent(url) {
  const response = await fetch(url)
  const result = await gatherResponse(response)
  return result
}

async function getContentWithHeaders(url, headers) {
  const response = await fetch(url, { headers: headers })
  const result = await gatherResponse(response)
  return result
}

async function fetchFormData(url, data) {
  const formdata = new FormData()
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      formdata.append(key, data[key])
    }
  }
  const requestOptions = {
    method: 'POST',
    body: formdata
  }
  const response = await fetch(url, requestOptions)
  const result = await gatherResponse(response)
  return result
}

async function fetchAccessToken() {
  url = OAUTH['oauthUrl'] + 'token'
  data = {
    'client_id': OAUTH['clientId'],
    'client_secret': OAUTH['clientSecret'],
    'grant_type': 'refresh_token',
    'requested_token_use': 'on_behalf_of',
    'refresh_token': OAUTH['refreshToken']
  }
  const result = await fetchFormData(url, data)
  return result.access_token
}

async function fetchFiles(path, fileName, passwd) {
  if (path === '/') path = ''
  if (path || EXPOSE_PATH) path = ':' + EXPOSE_PATH + path

  const accessToken = await fetchAccessToken()
  const uri = OAUTH.apiUrl + encodeURI(path)
    + '?expand=children(select=name,size,parentReference,lastModifiedDateTime,@microsoft.graph.downloadUrl)'
  const body = await getContentWithHeaders(uri, { Authorization: 'Bearer ' + accessToken })
  if (fileName) {
    let thisFile = null
    body.children.forEach(file => {
      if (file.name === decodeURIComponent(fileName)) {
        thisFile = file['@microsoft.graph.downloadUrl']
        return
      }
    })
    return thisFile
  } else {
    let files = []
    let encrypted = false
    for (let i = 0; i < body.children.length; i++) {
      const file = body.children[i]
      if (file.name === PASSWD_FILENAME) {
        const PASSWD = await getContent(file['@microsoft.graph.downloadUrl'])
        if (PASSWD !== passwd) {
          encrypted = true
          break
        } else {
          continue
        }
      }
      files.push({
        name: file.name,
        size: file.size,
        time: file.lastModifiedDateTime,
        url: file['@microsoft.graph.downloadUrl']
      })
    }
    let parent = body.children.length ? body.children[0].parentReference.path : body.parentReference.path
    parent = parent.split(':').pop().replace(EXPOSE_PATH, '') || '/'
    parent = decodeURIComponent(parent)
    if (encrypted) {
      return JSON.stringify({ parent: parent, files: [], encrypted: true })
    } else {
      return JSON.stringify({ parent: parent, files: files })
    }
  }
}
