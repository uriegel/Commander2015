using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Uploader
{
    [DataContract]
    public class LoginResult
    {
        [DataMember(Name="resultCode")]
        public int ResultCode;

        [DataMember(Name="sessionID")]
        public string SessionID;

        [DataMember(Name = "name")]
        public string Name;

        public LoginResult()
        {
        }

        public LoginResult(int resultCode, string sessionID, string name)
        {
            SessionID = sessionID;
            ResultCode = resultCode;
            Name = name;
        }
    }
}
