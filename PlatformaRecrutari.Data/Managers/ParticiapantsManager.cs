using PlatformaRecrutari.Core.Abstractions;
using PlatformaRecrutari.Core.BusinessObjects.Recruitment_Sessions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlatformaRecrutari.Data.Managers
{
    class ParticiapantsManager : IParticipantsManager
    {
        private readonly RepositoryContext _context;

        public ParticiapantsManager(RepositoryContext context)
        {
            _context = context;
        }

        public FormAnswers AddFormAnswer(FormAnswers answerToBeAdded)
        {
            var res = this._context.FormAnswers.Add(answerToBeAdded);
            _context.SaveChanges();

            return res.Entity;
        }
    
        public void DeleteFormAnswer(FormAnswers answerToBeDeleted) {
            this._context.FormAnswers.Remove(answerToBeDeleted);
            this._context.SaveChanges();
        }
    }
}
