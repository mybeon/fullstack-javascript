require("dotenv").config();
module.exports = function (username, token) {
  return `
  <html style="opacity: 1">
    <head>
      <title>Email Confirmation</title>
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <!--<![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <style type="text/css">
        #outlook a {
          padding: 0;
        }
        body {
          margin: 0;
          padding: 0;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        table,
        td {
          border-collapse: collapse;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }
        img {
          border: 0;
          height: auto;
          line-height: 100%;
          outline: none;
          text-decoration: none;
          -ms-interpolation-mode: bicubic;
        }
        p {
          display: block;
          margin: 13px 0;
        }
      </style>
      <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:AllowPNG />
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
      <![endif]-->
      <!--[if lte mso 11]>
        <style type="text/css">
          .mj-outlook-group-fix {
            width: 100% !important;
          }
        </style>
      <![endif]-->
      <style type="text/css">
        @media only screen and (min-width: 480px) {
          .mj-column-per-100 {
            width: 100% !important;
            max-width: 100%;
          }
        }
      </style>
      <style media="screen and (min-width:480px)">
        .moz-text-html .mj-column-per-100 {
          width: 100% !important;
          max-width: 100%;
        }
      </style>
      <style type="text/css">
        [owa] .mj-column-per-100 {
          width: 100% !important;
          max-width: 100%;
        }
      </style>
      <style type="text/css">
        @media only screen and (max-width: 480px) {
          table.mj-full-width-mobile {
            width: 100% !important;
          }
          td.mj-full-width-mobile {
            width: auto !important;
          }
        }
      </style>
    </head>
    <body style="word-spacing: normal; background-color: #f4f4f4">
      <div style="background-color: #f4f4f4">
        <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
        <div style="margin: 0px auto; max-width: 600px">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%">
            <tbody>
              <tr>
                <td style="direction: ltr; font-size: 0px; padding: 20px 0px 20px 0px; text-align: center">
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size: 0px; text-align: left; direction: ltr; display: inline-block; vertical-align: top; width: 100%">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align: top" width="100%">
                      <tbody>
                        <tr>
                          <td align="left" style="font-size: 0px; padding: 0px 0px 0px 25px; padding-top: 0px; padding-bottom: 0px; word-break: break-word">
                            <div style="font-family: Arial, sans-serif; font-size: 13px; letter-spacing: normal; line-height: 1; text-align: left; color: #000000"><p style="margin: 10px 0"></p></div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="transparent" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><v:rect style="width:600px;" xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false"><v:fill origin="0.5, 0" position="0.5, 0" src="http://go.mailjet.com/tplimg/mtrq/b/ox8s/mg1qn.png" color="transparent" type="tile" /><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0"><![endif]-->
        <div
          style="
            background: transparent url('http://go.mailjet.com/tplimg/mtrq/b/ox8s/mg1qn.png') center top / auto repeat;
            background-position: center top;
            background-repeat: repeat;
            background-size: auto;
            margin: 0px auto;
            max-width: 600px;
          "
        >
          <div style="line-height: 0; font-size: 0">
            <table
              align="center"
              background="http://go.mailjet.com/tplimg/mtrq/b/ox8s/mg1qn.png"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="
                background: transparent url('http://go.mailjet.com/tplimg/mtrq/b/ox8s/mg1qn.png') center top / auto repeat;
                background-position: center top;
                background-repeat: repeat;
                background-size: auto;
                width: 100%;
              "
            >
              <tbody>
                <tr>
                  <td style="direction: ltr; font-size: 0px; padding: 20px 0; text-align: center">
                    <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                    <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size: 0px; text-align: left; direction: ltr; display: inline-block; vertical-align: top; width: 100%">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align: top" width="100%">
                        <tbody>
                          <tr>
                            <td align="center" vertical-align="top" style="font-size: 0px; padding: 10px 25px; word-break: break-word">
                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse; border-spacing: 0px">
                                <tbody>
                                  <tr>
                                    <td style="width: 200px">
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <!--[if mso | IE]></td></tr></table><![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!--[if mso | IE]></v:textbox></v:rect></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
        <div style="background: #ffffff; background-color: #ffffff; margin: 0px auto; max-width: 600px">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background: #ffffff; background-color: #ffffff; width: 100%">
            <tbody>
              <tr>
                <td style="direction: ltr; font-size: 0px; padding: 20px 0; text-align: center">
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size: 0px; text-align: left; direction: ltr; display: inline-block; vertical-align: top; width: 100%">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align: top" width="100%">
                      <tbody>
                        <tr>
                          <td align="left" vertical-align="top" style="font-size: 0px; padding: 10px 25px; padding-top: 0px; padding-bottom: 0px; word-break: break-word">
                            <div style="font-family: Arial, sans-serif; font-size: 13px; letter-spacing: normal; line-height: 1; text-align: left; color: #000000">
                              <p style="text-align: left; margin: 10px 0; margin-top: 10px"><span style="font-size: 18px; text-align: left; color: #5e6977; font-family: Arial; line-height: 20px">Dear ${username},</span></p>
                              <p style="text-align: left; margin: 10px 0; margin-bottom: 10px">
                                <span style="font-size: 18px; text-align: left; color: #5e6977; font-family: Arial; line-height: 20px">Welcome to CApp. Please confirm you </span
                                ><span style="font-size: 18px; text-align: left; color: #5e6977; font-family: Arial; line-height: 20px"><b>email address</b></span
                                ><span style="font-size: 18px; text-align: left; color: #5e6977; font-family: Arial; line-height: 20px"> by clicking on the button below.</span>
                              </p>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" vertical-align="top" style="font-size: 0px; padding: 15px 30px; word-break: break-word">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: separate; line-height: 100%">
                              <tbody>
                                <tr>
                                  <td align="center" bgcolor="#41B8FF" role="presentation" style="border: none; border-radius: 0px; cursor: auto; mso-padding-alt: 10px 25px; background: #41b8ff" valign="top">
                                    <a
                                      href="${process.env.NODE_ENV ? process.env.PROD_URL : process.env.DEV_URL}/verify/${token}"
                                      style="
                                        display: inline-block;
                                        background: #41b8ff;
                                        color: #ffffff;
                                        font-family: Arial, sans-serif;
                                        font-size: 13px;
                                        font-weight: normal;
                                        line-height: 120%;
                                        margin: 0;
                                        text-decoration: none;
                                        text-transform: none;
                                        padding: 10px 25px;
                                        mso-padding-alt: 0px;
                                        border-radius: 0px;
                                      "
                                      target="_blank"
                                      ><span style="font-size: 13px; text-align: center; background-color: #41b8ff; color: #ffffff; font-family: Arial"><b>CONFIRM EMAIL</b></span></a
                                    >
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
        <div style="background: #ffffff; background-color: #ffffff; margin: 0px auto; max-width: 600px">
          <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background: #ffffff; background-color: #ffffff; width: 100%">
            <tbody>
              <tr>
                <td style="direction: ltr; font-size: 0px; padding: 20px 0; text-align: center">
                  <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size: 0px; text-align: left; direction: ltr; display: inline-block; vertical-align: top; width: 100%">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align: top" width="100%">
                      <tbody>
                        <tr>
                          <td align="left" style="font-size: 0px; padding: 10px 25px; padding-top: 0px; padding-bottom: 0px; word-break: break-word">
                            <div style="font-family: Arial, sans-serif; font-size: 13px; letter-spacing: normal; line-height: 1; text-align: left; color: #000000">
                              <p style="text-align: left; margin: 10px 0; margin-top: 10px">
                                <span style="font-size: 16px; text-align: left; color: #5e6977; font-family: Arial; line-height: 13px"
                                  >If the button doesn't work, please copy paste the following link in your browser:</span
                                >
                              </p>
                              <p style="text-align: left; margin: 10px 0; margin-bottom: 10px">
                                <span style="font-size: 16px; text-align: left; color: #5e6977; font-family: Arial; line-height: 13px"><b>${
                                  process.env.NODE_ENV ? process.env.PROD_URL : process.env.DEV_URL
                                }/verify/${token}</b></span>
                              </p>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td align="left" style="font-size: 0px; padding: 10px 25px; padding-top: 15px; padding-bottom: 0px; word-break: break-word">
                            <div style="font-family: Arial, sans-serif; font-size: 13px; letter-spacing: normal; line-height: 1; text-align: left; color: #000000">
                              <p style="text-align: left; margin: 10px 0; margin-top: 10px; margin-bottom: 10px">
                                <span style="line-height: 22px; font-size: 18px; font-family: Arial; color: #5e6977; text-align: left">Cheers, The CApp Team.</span>
                              </p>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <!--[if mso | IE]></td></tr></table><![endif]-->
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]></td></tr></table><![endif]-->
      </div>
    </body>
  </html>
  `;
};
