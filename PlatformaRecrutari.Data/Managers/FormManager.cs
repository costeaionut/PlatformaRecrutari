using PlatformaRecrutari.Core.Abstractions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.FormQuestions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Inputed_Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Data.Managers
{
    public class FormManager : IFormManager
    {
        private readonly RepositoryContext _context;

        public FormManager(RepositoryContext context)
        {
            this._context = context;
        }

        public async Task<Form> createForm(Form newForm)
        {
            var res = _context.Forms.Add(newForm);
            await _context.SaveChangesAsync();
            return res.Entity;
        }

        public async Task<GridQuestion> addGridQuestionToForm(GridQuestion newQuestion)
        {
            var res = _context.GridQuestions.Add(newQuestion);
            await _context.SaveChangesAsync();
            return res.Entity;
        }

        public async Task<InputsOption> addOptionsToQuestion(InputsOption inputsOption)
        {
            var res = _context.InputsOptions.Add(inputsOption);
            await _context.SaveChangesAsync();
            return res.Entity;
        }

        public async Task<BaseQuestion> addSimpleQuestionToForm(BaseQuestion newQuestion)
        {
            var res = _context.SimpleQuestions.Add(newQuestion);
            await _context.SaveChangesAsync();
            return res.Entity;
        }
    }
}
