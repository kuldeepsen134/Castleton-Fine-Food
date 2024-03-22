const md5 = require('md5')
const { User } = require('../models')
const { loginUser } = require('./validator/auth')
const { handleError } = require('../utils/helpers')


exports.login = async (req, res) => {

  const { error } = loginUser.validate(req.body,)

  if (error) {
    handleError(error, req, res, 0)
    return
  }

  console.log(md5(req.body.password));

  const user = await User.findOne({ where: { email: req.body.email, password: md5(req.body.password) } })
res.send({user})

}

// exports.resetPasswordEmail = async (req, res) => {

//   const { error, } = resetPasswordEmail.validate(req.body,)

//   if (error) {
//     handleError(error, req, res)
//     return
//   }

//   const user = await User.findOne({ where: { email: req.body.email } })

//   if (user) {
//     const email = req.body.email

//     const encyrptedEmail = emailEncyption(email)

//     const token = createUUID()
//     const link = `${process.env.FRONTEND_URL}reset-password?token=${token}`
//     const subject = 'Your forgot password link'

//     const message = `<div style="margin:auto width:70%">
//     <div style="font-family: Helvetica,Arial,sans-serifmin-width:1000pxoverflow:autoline-height:2">
//     <div style="margin:50px autowidth:60%padding:20px 0">
//       <div style="border-bottom:1px solid #eee">
//         <a href="" style="font-size:1.4emcolor: #00466atext-decoration:nonefont-weight:600">POS-System</a>
//       </div>
//       <p style="font-size:25px">Hello ${user.first_name} ${user.last_name},</p>
      
//       <p>Use the code below to recover access to your POS-System account.</p>
     
//       <h3 style="background:#e6f3ffwidth:fullmargin: 0 autopadding:10px">
//       <a href=${link} style=text-decoration:none><h3 style="background:#e6f3ffwidth:fullmargin: 0 autopadding:10px">Reset Password</h3></a></h3>
      
//       <p>The recovery code is only valid for 24 hours after it’s generated. If your code has already expired, you can restart the recovery process and generate a new code.
//       If you haven't initiated an account recovery or password reset in the last 24 hours, ignore this message.</p>

//       <p style="font-size:0.9em">Best Regards,<br />POS-System</p>
//     </div>
//   </div>
//   </div>`

//     User.update({
//       email: email,
//       token: token
//     },
//       { where: { id: user.id } })
//       .then(data => {
//         sendEmail(email, user.first_name, subject, message)
//         handleResponse(res, [], `${strings.WeHaveSentRecoveryCodeToTheEmail} ${encyrptedEmail}`)
//       })
//       .catch(err => {
//         handleError(err, req, res)
//       })
//   }

//   if (user === null) {
//     res.status(400).send({ error: true, message: strings.UserNotFound })
//   }
// }

// exports.updatePassword = async (req, res) => {
//   const { error, value } = updatePassword.validate(req.body,)

//   if (error) {
//     handleError(error, req, res)
//     return
//   }

//   const token = req.body.token
//   const newPassword = req.body.new_password
//   const confirmPassword = req.body.confirm_password

//   if (newPassword === confirmPassword) {
//     const password = newPassword
//     const user = await User.findOne({ where: { token: token } })
//     if (user) {
//       User.update({
//         token: null,
//         password: md5(password)
//       },
//         { where: { id: user.id } })
//         .catch(err => {
//           handleError(err, req, res)
//         })
//       return res.send(200, {
//         messsage: strings.YouSuccessfullyResetYourPassword,
//         error: false
//       })
//     }

//   } else {
//     return res.status(400).send({
//       message: strings.ConfirmPasswordDoesNotMatch,
//       error: true
//     })
//   }
//   return res.status(400).send({
//     message: strings.ThisVerificationLinkHasAlreadyBeenUsed,
//     error: true
//   })
// }

// exports.me = async (req, res) => {

//   await User.findOne({ where: { id: req.headers.user_id } })
//     .then(data => {
//       handleResponse(res, data.dataValues)
//     }).catch(err => {
//       handleError(err, req, res)
//     })
// }