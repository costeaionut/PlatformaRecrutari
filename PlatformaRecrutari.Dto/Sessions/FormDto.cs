﻿using PlatformaRecrutari.Dto.Sessions.FormQuesitons;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Dto.Sessions
{
    public class FormDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public List<ShortQuestionDto> ShortQuestions { get; set; }
        public List<MultipleQuestionDto> MultipleQuestions { get; set; }
        public List<SelectBoxesQuestionDto> SelectBoxesQuestions { get; set; }
        public List<GridMultipleQuestionDto> GridMultipleQuestions { get; set; }
        public List<GridSelectBoxesQuestionDto> GridSelectBoxesQuestions { get; set; }
    }
}
