﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Commander
{
    class MoveOperation : Operation
    {
        public MoveOperation(string sourceDir, string targetDir, IOItem[] items)
            : base(sourceDir, targetDir, items)
        {
        }

        protected override void RunOperation(IEnumerable<OperationItem> operationItems, bool ignoreConflicts)
        {
            FileOperation fi = new FileOperation(sourceProcessor.Directory, targetProcessor.Directory, Api.FileFuncFlags.FO_MOVE);
            if (conflictItems == null || ignoreConflicts)
                fi.Copy(items);
            else if (conflictItems != null && conflictItems.Length > 0 && !ignoreConflicts)
                fi.Copy(operationItems, conflictItems);
        }

        protected override bool IsDualOperation()
        {
            return true;
        }

        protected override bool CheckExtendedCompatibility()
        {
            if (targetProcessor is DriveProcessor)
                return false;
            return true;
        }
    }
}
