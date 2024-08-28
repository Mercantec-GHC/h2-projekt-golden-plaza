using API.Models.Entities;

namespace API.Services;

public interface IMailService
{
    bool SendMail(MailData Mail_Data);
}