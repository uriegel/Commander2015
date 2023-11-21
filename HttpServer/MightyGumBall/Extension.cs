using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Timers;
using HttpServer;

namespace MightyGumBall
{
    public class Extension : IExtension
    {
        #region IExtension Members

        public void Request(ISession session, Method method, string path, UrlQueryComponents urlQuery)
        {
            this.session = session;
            if (urlQuery.Method == null)
            {
                // aus Post holen
            }

            Sale[] sales = new []{ new Sale("Horrem", 3), new Sale("Sindorf", 45), new Sale("Kerpen", 1)};
            session.SendJson(sales);
        }

        public void InitializeWebSocket(ISession session)
        {
            this.session = session;
            byte[] buffer = new byte[1024];
            session.WsBeginReceive(buffer, WsAsyncCallback, buffer);
            timer = new Timer(2000);
            timer.Elapsed += timer_Elapsed;
            timer.Start();
        }

        #endregion

        #region Methods

        void Rechne(Dictionary<string, string> parms)
        {
            //int x1 = int.Parse(parms["x1"]);
            //int x2 = int.Parse(parms["x2"]);
            //int result = x1 * x2;
            //RechneResult rr = new RechneResult(x1, x2, result);
            //session.SendJson(rr);
        }

        void WsAsyncCallback(IAsyncResult ar)
        {
            byte[] buffer = ar.AsyncState as byte[];
            int read = session.WsEndReceive(ar);
            Console.WriteLine(session.DecodeWSBuffer(buffer));
            session.WsBeginReceive(buffer, WsAsyncCallback, buffer);
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
        Timer timer;

        #endregion
    }
}