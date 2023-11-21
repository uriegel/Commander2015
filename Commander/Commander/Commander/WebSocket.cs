using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Timers;
using HttpServer;

namespace Commander
{
    class WebSocket
    {
        #region Constructor 

        public WebSocket(ISession session)
        {
            this.session = session;
            byte[] buffer = new byte[1024];
            session.WsBeginReceive(buffer, WsAsyncCallback, buffer);
        }

        #endregion

        #region Methods

        void WsAsyncCallback(IAsyncResult ar)
        {
            try
            {
                byte[] buffer = ar.AsyncState as byte[];

                session.WsBeginReceive(buffer, WsAsyncCallback, buffer);
            }
            catch (Exception)
            {
                session = null;
            }
        }

        #endregion

        #region Event Handlers

        void timer_Elapsed(object sender, ElapsedEventArgs e)
        {
            session.WsSend(DateTime.Now.ToString());
        }

        #endregion

        #region Fields

        ISession session;

        #endregion
    }
}
