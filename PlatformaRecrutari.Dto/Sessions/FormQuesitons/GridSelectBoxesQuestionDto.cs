using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Dto.Sessions.FormQuesitons
{
    public class GridSelectBoxesQuestionDto : BaseQuestionDto
    {
        public List<String> Rows { get; set; }
        public List<String> Columns { get; set; }
        public bool OneAnswerPerColumn { get; set; }
    }
}
