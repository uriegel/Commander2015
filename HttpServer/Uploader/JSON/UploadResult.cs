using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace Uploader
{
    [DataContract]
    public class UploadResult
    {
        [DataMember(Name="resultCode")]
        public int ResultCode;

        [DataMember(Name="url")]
        public string Url;

        public UploadResult()
        {
        }

        public UploadResult(int resultCode, string url)
        {
            Url = url;
            ResultCode = resultCode;
        }
    }
}
