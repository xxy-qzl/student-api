  const express = require ('express')
  const jsonServer = require('json-server')
  const Axios = require('axios')
  const bcryptjs = require('bcryptjs')
  const routes = jsonServer.router('./db.json')
  const middlewares = jsonServer.defaults()
  const server = express()
  Axios.defaults.baseURL = 'http://localhost:9090'
  // req.body 的处理
  server.use(express.json())
  server.use(express.urlencoded({ extended: true }))

  // 处理跨域问题
  server.use( ( req, res, next ) => {
    res.set ( 'Access-Control-Allow-Origin', '*' )
    next()
  })

  // 这里可以放自己做的一些借口，比如注册登录什么的

  // 注册接口
  server.post( '/login-up', async(req, res) => {
    const response = await Axios.get('/users', {
      params: {
        username: req.body.username
      }
    })

    if( response.data.length > 0 ) {
      res.send ({
        code: -1,
        msg: "该用户名已被注册"
      })
      return
    }

    const { data } = await Axios.post( '/users', {
      ...req.body,
      password: await bcryptjs.hash( req.body.password, 10 )
    } )
    res.send({
      code: 0,
      msg: "注册成功",
      data
    })
    
  })

  // 登录接口
  server.post('/login-in', async(req, res) => {
    const { username, password } = req.body
    const { data } = await Axios.get('/users', {
      params: {
        username
      }
    })

    if( data.length <= 0 ) {
      res.send({
        code: -1,
        msg: '用户名或密码错误'
      })
      return
    }

    const user = data[0]
    const isOk = await bcryptjs.compare(password, user.password)
    if( isOk ){
      res.send({
        code: 0,
        msg: '登录成功'
      })
    }else{
      res.send({
        code: -1,
        msg: '用户名或密码输入错误'
      })
    }
  })


  // json 假数据
  server.use(middlewares)
  server.use(routes)
  server.listen(9090)
