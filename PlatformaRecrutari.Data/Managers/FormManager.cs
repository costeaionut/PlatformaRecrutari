using PlatformaRecrutari.Core.Abstractions;
using PlatformaRecrutari.Core.BusinessObjects;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.FormQuestions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Inputed_Options;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions.Participant_Status;
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
            => this._context.SimpleQuestions.Where(
                sq => sq.FormId == formId && 
                (sq.Type == "ShortQuestion" || sq.Type == "MultipleQuestion" || sq.Type == "SelectBoxesQuestion"))
            .ToList();

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

        public void updateBaseQuestion(BaseQuestion updatedQuestion)
        {
            var oldQuestion = this._context.SimpleQuestions.FirstOrDefault(sq => sq.Id == updatedQuestion.Id);
            oldQuestion.Position = updatedQuestion.Position;
            oldQuestion.Question = updatedQuestion.Question;
            oldQuestion.Required = updatedQuestion.Required;
            oldQuestion.Type = updatedQuestion.Type;
            this._context.SaveChanges();
        }

        public void updateGridQuestion(GridQuestion updatedGridQuestion)
        {
            var oldQuestion = this._context.GridQuestions.FirstOrDefault(gq => gq.Id == updatedGridQuestion.Id);
            oldQuestion.OneAnswerPerColumn = updatedGridQuestion.OneAnswerPerColumn;
            oldQuestion.Position = updatedGridQuestion.Position;
            oldQuestion.Question = updatedGridQuestion.Question;
            oldQuestion.Required = updatedGridQuestion.Required;
            oldQuestion.Type = updatedGridQuestion.Type;
            this._context.SaveChanges();
        }

        public void updateForm(Form updatedForm)
        {
            var oldForm = this._context.Forms.FirstOrDefault(f => f.Id == updatedForm.Id);
            oldForm.Title = updatedForm.Title;
            oldForm.Description = updatedForm.Description;
            oldForm.StartDate = updatedForm.StartDate;
            oldForm.EndDate = updatedForm.EndDate;
            this._context.SaveChanges();
        }
    
        public async Task updateQuestionOptionsAsync(int questionId, List<InputsOption> updatedInputs) {
            var inputOptions = this._context.InputsOptions.Where(i => i.QuestionId == questionId).ToList();
            this._context.InputsOptions.RemoveRange(inputOptions);

            foreach (var item in updatedInputs)
            {
                await this.addOptionsToQuestion(item);
            }

        }
    
        public void deleteBaseQuestion(int questionId) {
            var questionToBeDeleted = this._context.SimpleQuestions.FirstOrDefault(sq => sq.Id == questionId);
            this._context.SimpleQuestions.Remove(questionToBeDeleted);
            this._context.SaveChanges();
        }

        public void deleteGridQuestion(int questionId)
        {
            var questionToBeDeleted = this._context.GridQuestions.FirstOrDefault(gq => gq.Id == questionId);
            this._context.Remove(questionToBeDeleted);
            this._context.SaveChanges();
        }

        public List<User> getUsersWhoPassedForm(int formId)
        {
            var ids = _context.FormFeedbacks
                .Where(ff => ff.FormId == formId && ff.Status == StatusType.PassedForm)
                .Select(ff => ff.CandidateId)
                .ToList();
            List<User> formPassedUsers = _context.Users.Where(u => ids.Contains(u.Id)).ToList();

            return formPassedUsers;
        }
    }
}
