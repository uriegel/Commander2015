using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using HttpServer;

namespace Uploader
{
    public class Extension : IExtension
    {
        #region IExtension Members

        public void Request(ISession serverSession, Method method, string path, UrlQueryComponents urlQuery)
        {
            switch (urlQuery.Method.ToLower())
            {
                case "login":
                    Session session = new Session(urlQuery.Parameters["user"]);
                    sessions[session.ID] = session;
                    LoginResult result = new LoginResult(0, session.ID, session.Name);
                    serverSession.SendJson(result);
                    break;
                case "uploadmyimage":
                    try
                    {
                        string sid = urlQuery.Parameters["sessionid"];
                        session = sessions[sid];

                        using (Stream stream = File.OpenWrite(@"c:\users\uwe\desktop\bild.png"))
                        {
                            serverSession.ReadStream(stream);
                        }

                        serverSession.SendOK("Succeeded");
                        break;
                    }
                    catch (Exception)
                    {
                        serverSession.SendError("Upload fehlgeschlagen", 
                            "<h1>Upload fehlgeschlagen</h1><p>Für diese Operation ist ein Login erfoderlich.</p>",
                            401, 
                            "Unauthorized");
                        break;
                    }
            }
        }

        public void InitializeWebSocket(ISession session)
        {
            
        }

        #endregion

        #region Fields

        Dictionary<string, Session> sessions = new Dictionary<string, Session>();

        #endregion
    }
}
