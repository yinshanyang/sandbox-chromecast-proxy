const allowCors = (fn) => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Range'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

const handler = async (req, res) => {
  const { query } = req
  const url = new URL(
    'https://widevine-dash.ezdrm.com/widevine-php/widevine-foreignkey.php'
  )
  Object.keys(query).forEach((key) => {
    url.searchParams.append(key, query[key])
  })

  try {
    const proxy = await fetch(url.href, {
      method: req.method,
      headers: { ...req.headers, host: 'widevine-dash.ezdrm.com' },
    })
    console.log({
      method: req.method,
      headers: {
        ...req.headers,
        host: 'widevine-dash.ezdrm.com',
        origin: 'https://client.dev.laminar.video',
        referer: 'https://client.dev.laminar.video',
      },
    })
    const buffer = await proxy.buffer()
    console.log(req)
    console.log(proxy)
    res.status(200).send('hello')
  } catch (error) {
    res.status(400).send(error.toString())
  }
}

export default allowCors(handler)
