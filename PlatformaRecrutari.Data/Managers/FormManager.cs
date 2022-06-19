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

        public Form getFormBySessionId(int sessionId)
        {
            var forms = this._context.Forms.Where<Form>(f => f.SessionId == sessionId).ToList();
            if (forms.Count > 1)
                throw new Exception("MultipleFormsPerSession");
            
            return forms.FirstOrDefault();
        }
    
        public List<BaseQuestion> getFormsBaseQuestion(int formId)
            => this._context.SimpleQuestions.Where(sq => sq.FormId == formId).ToList();

        public List<GridQuestion> getFormsGridQuestion(int formId) =>
            this._context.GridQuestions.Where(gq => gq.FormId == formId).ToList();

        public List<string> getColumnsForGridQuestion(int questionId)
        {
            var inputOptions = this._context.InputsOptions
                   .Where(i => i.QuestionId == questionId).ToList();

            var columns = new List<string>();

            foreach (var inputOption in inputOptions)
                if (inputOption.Type == InputTypes.Column)
                    columns.Add(inputOption.Content);

            return columns;
        }

        public List<string> getRowsForGridQuestion(int questionId)
        {
            var inputOptions = this._context.InputsOptions
                   .Where(i => i.QuestionId == questionId).ToList();

            var rows = new List<string>();

            foreach (var inputOption in inputOptions)
                if (inputOption.Type == InputTypes.Row)
                    rows.Add(inputOption.Content);

            return rows;
        }

        public List<string> getOptionsForBaseQuestion(int questionId)
        {
            var inputOptions = this._context.InputsOptions
                   .Where(i => i.QuestionId == questionId).ToList();

            var option = new List<string>();

            foreach (var inputOption in inputOptions)
                if (inputOption.Type == InputTypes.Option)
                    option.Add(inputOption.Content);

            return option;
        }

        public Form getFormById(int formId) =>
            this._context.Forms.FirstOrDefault(f => f.Id == formId);
    }
}
