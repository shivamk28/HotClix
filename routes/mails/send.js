
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SANDGRID_API_KEY)



const sendMailVerificationMessage =  function (email,name,token) {
      let url =  `http://localhost:5000/api/users/verifi?token=${token}`;
    const msg = {
        to:  email,
        from: process.env.SANDGRID_SENDER,
        subject: 'HotClix Mail Verificaion',
        text: 'Verify EMail',
        html: `<h1 style="color: indianred">Click on to this link to verify your Mail</h1><br> <a href=${url}> Click Here to verify</a>`

    }
    
    let status = -1; 
    return sgMail.send(msg)
   
}


module.exports = {
    sendMailVerificationMessage,


}