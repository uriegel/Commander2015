using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Windows;
using HttpServer;

namespace Commander
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        public App()
        {
            var kl = Environment.GetCommandLineArgs();
            string root = (Environment.GetCommandLineArgs().Length > 1 && Environment.GetCommandLineArgs()[1] == "-webroot") ? @"..\..\..\..\webroot\Commander" : ".";
            Configuration configuration = new Configuration
            {
                Webroot = root,
                Port = 9865,
            };
            configuration.Extensions.Add(new HttpServer.Extension("/Commander", new Extension()));
            Server server = new Server(configuration);
            server.Start();
        }
    }
}
