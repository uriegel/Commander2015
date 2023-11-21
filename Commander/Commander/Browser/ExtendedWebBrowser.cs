using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Interop;

namespace Commander
{
    public static class ExtendedWebBrowser
    {
        public static void Initialize(this WebBrowser browser, Window window, Uri source)
        {
            ExtendedWebBrowser.window = window;
            wbHandler = new WebBrowserHostUIHandler(browser);
            wbHandler.IsWebBrowserContextMenuEnabled = false;
            wbHandler.ScriptErrorsSuppressed = true;
            wbHandler.Flags |= HostUIFlags.ENABLE_REDIRECT_NOTIFICATION | HostUIFlags.DPI_AWARE;
            browser.Navigated += browser_Navigated;
            ExtendedWebBrowser.source = source;
            ExtendedWebBrowser.browser = browser;
            browser.Source = new Uri("about:blank");
        }

        static void browser_Navigated(object sender, System.Windows.Navigation.NavigationEventArgs e)
        {
            if (first)
            {
                first = false;
                ICustomDoc doc = browser.Document as ICustomDoc;
                if (doc != null)
                    doc.SetUIHandler(wbHandler);
                browser.Source = source;
            }
            WebBrowserHostUIHandler.SetSilent(browser, wbHandler.ScriptErrorsSuppressed);
        }

        // TODO: AttachedProperty von WebBrowser
        static Window window;
        static WebBrowserHostUIHandler wbHandler;
        static WebBrowser browser;
        static Uri source;
        static bool first = true;
    }
}
