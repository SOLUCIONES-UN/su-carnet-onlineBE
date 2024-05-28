export class HtmlEmail {
  static bodyForConfirmationCode(names: string, surNames: string, otp: string, action: string): string {

    switch (action) {
      case 'create':
        action = "usuario";
        break;
      case 'update':
        action = "cambio de contraseña";
        break;
      
    }

    return `
      <!DOCTYPE html>
      <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <meta name="x-apple-disable-message-reformatting">
          <title></title>
          <style>
            table, td, div, h1, p {font-family: Arial, sans-serif;}
            @media screen and (max-width: 530px) {
              .unsub {
                display: block;
                padding: 8px;
                margin-top: 14px;
                border-radius: 6px;
                background-color: #ffffff;
                text-decoration: none !important;
                font-weight: bold;
              }
              .col-lge {max-width: 100% !important;}
            }
            @media screen and (min-width: 531px) {
              .col-sml {max-width: 27% !important;}
              .col-lge {max-width: 73% !important;}
            }
          </style>
        </head>
        <body style="margin:0;padding:0;word-spacing:normal;background-color:#ffff;">
          <div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#b9b7b7;">
            <table role="" style="width:100%;border:none;border-spacing:0;">
              <tr>
                <td align="center" style="padding:0;">
                  <table role="presentation" style="width:94%;max-width:600px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">
                    <tr>
                      <td style="padding:40px 30px 30px 30px;text-align:center;font-size:24px;font-weight:bold;"></td>
                    </tr>
                    <tr>
                      <td style="padding:30px;background-color:#ffffff;">
                        <a align="center" style="padding:0;">
                          <img src="../img/logo.svg" width="165" alt="Logo" style="width:165px;max-width:80%;height:auto;border:none;text-decoration:none;color:#ffffff;">
                        </a>
                        <h1></h1><h1></h1>
                        <h1 style="margin-top:0;margin-bottom:16px;font-size:26px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;">
                          Hola ${names} ${surNames}
                        </h1>
                        <p style="margin:0;">
                          Confirma tu ${action} utilizando el siguiente código. Es válido únicamente por 15 minutos, después tendrás que generar uno nuevo.
                        </p>
                        <h2></h2><h2></h2>
                        <p align="center" style="margin:0;">Tu código es:</p>
                        <h1 align="center" style="padding:0;margin-top:0;margin-bottom:16px;font-size:26px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;">
                          ${otp}
                        </h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:30px;font-size:24px;line-height:28px;font-weight:bold;background-color:#ffffff;border-bottom:1px solid #f0f0f5;border-color:rgba(201,201,207,.35);">
                        <a style="text-decoration:none;">
                          <img src="../img/Diseño sin título.svg" width="540" alt="" style="width:100%;height:auto;border:none;text-decoration:none;color:#363636;">
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:30px;text-align:center;font-size:12px;background-color:#404040;color:#ccc;"></td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>
        </body>
      </html>
    `;
  }
}