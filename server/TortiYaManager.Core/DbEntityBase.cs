using System;

namespace TortiYaManager.Core;

public class DbEntityBase : IDbEntity
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
}