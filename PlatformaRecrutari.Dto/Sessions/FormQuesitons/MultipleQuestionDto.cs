﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Dto.Sessions.FormQuesitons
{
    public class MultipleQuestionDto : BaseQuestionDto
    {
        public List<String> Options { get; set; }
    }
}
