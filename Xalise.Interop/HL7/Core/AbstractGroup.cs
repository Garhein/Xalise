using System;
using System.Collections.Generic;
using System.Reflection;
using Xalise.Core.Helpers;
using Xalise.Interop.Exceptions;
using Xalise.Interop.HL7.Enums;

namespace Xalise.Interop.HL7.Core
{
    public abstract class AbstractGroup : IGroup
    {
        private List<MessageItem> _items;

        public AbstractGroup(IGroup parentStructure)
        {
            this.ParentStructure    = parentStructure;
            this._items             = new List<MessageItem>();
        }

        /// <inheritdoc/>
        public IMessage Message
        {
            get
            {
                IStructure structure = this;

                while (!(structure is IMessage))
                {
                    structure = structure.ParentStructure;
                }

                return (IMessage)structure;
            }
        }

        /// <inheritdoc/>
        public IGroup ParentStructure { get; }

        /// <inheritdoc/>
        public string StructureName
        {
            get
            {
                return TypeHelper.GetTypeName(this);
            }
        }

        /// <inheritdoc/>
        public string[] Names
        { 
            get
            {
                string[] ret = new string[this._items.Count];

                for (int i = 0; i < this._items.Count; i++)
                {
                    ret[i] = this._items[i].Name;
                }

                return ret;
            }
        }

        /// <inheritdoc/>
        public IStructure[] GetAll(string name)
        {
            MessageItem item = this.GetMessageItem(name);

            return item.Structures.ToArray();
        }

        /// <inheritdoc/>
        public IStructure GetStructure(string name)
        {
            return this.GetStructure(name, 1);
        }

        /// <inheritdoc/>
        public IStructure GetStructure(string name, int repetition)
        {
            // repetition => base 1
            if (repetition < 1)
            {
                throw new HL7Exception($"L'accès à une structure du groupe '{this.StructureName}' doit être réalisé à partir de l'index 1 (index utilisé : {repetition}).");
            }

            MessageItem item    = this.GetMessageItem(name);
            int currentRep      = item.Structures.Count;

            // Création d'une répétition si nécessaire et si la limite maximale n'est pas atteinte
            if (repetition > currentRep)
            {
                if (repetition > item.MaxRepetitions)
                {
                    throw new HL7Exception($"Impossible d'ajouter une répétition à la structure {this.StructureName} : le nombre maximal autorisé de répétition est de {item.MaxRepetitions}.");
                }
                else
                {
                    this._items[repetition - 1].Structures.Add(this.CreateNewStructure(item.Type));
                }
            }

            return item.Structures[repetition - 1];
        }

        /// <inheritdoc/>
        public EnumDataUsage GetUsage(string name)
        {
            return this.GetMessageItem(name).Usage;
        }

        /// <inheritdoc/>
        public bool IsRepeating(string name)
        {
            return this.GetMessageItem(name).MaxRepetitions > 1;
        }

        /// <inheritdoc/>
        public bool IsChoiceElement(string name)
        {
            return this.GetMessageItem(name).IsChoiceElement;
        }

        /// <inheritdoc/>
        public bool IsGroup(string name)
        {
            MessageItem item = this.GetMessageItem(name);
            return typeof(IGroup).IsAssignableFrom(item.Type);
        }

        /// <inheritdoc/>
        public Type GetType(string name)
        {
            return this.GetMessageItem(name).Type;
        }

        public void RemoveStructure(string name, IStructure structureToRemove)
        {

        }

        public void RemoveStructure(string name, int repetition)
        {

        }

        /// <summary>
        /// Récupère le nom de répétitions d'une structure.
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public int CountRepetitions(string name)
        {

        }

        /// <summary>
        /// Ajout d'un MessageItem dans '_items'
        /// </summary>
        private void Insert()
        {

        }

        private bool NameExists(string name)
        {

        }

        // Suite DEV : AbstractMessage
        // Remettre les bonnes propriétés sur les types de données (pas IHE PAM) : les spécificités IHE PAM seront 'injectées' et 'fournies' au méthode d'encodage

        private MessageItem GetMessageItem(string name)
        {
            MessageItem item = null;

            int pos = this._items.FindIndex(x => x.Name == name);
            if (pos >= 0)
            {
                item = this._items[pos];
            }

            if (item == null)
            {
                throw new HL7Exception($"La structure '{name}' n'existe pas dans le groupe '{this.StructureName}'.");
            }

            return item;
        }

        private IStructure CreateNewStructure(Type typeStructure)
        {
            IStructure newStruct = null;

            try
            {
                Object[] args   = new Object[1] { this };
                Type[] argsType = new Type[] { typeof(IGroup) };
                newStruct       = (IStructure)typeStructure.GetConstructor(argsType).Invoke(args);
            }
            catch (UnauthorizedAccessException authAccessEx)
            {
                throw new HL7Exception($"Impossible d'accéder à la classe '{typeStructure.FullName}' ({authAccessEx.GetType().FullName}) : {authAccessEx.Message}", authAccessEx);
            }
            catch (TargetInvocationException targetIncovationEx)
            {
                throw new HL7Exception($"Impossible d'instancier la classe '{typeStructure.FullName}' ({targetIncovationEx.GetType().FullName}) : {targetIncovationEx.Message}", targetIncovationEx);
            }
            catch (MethodAccessException methodAccessEx)
            {
                throw new HL7Exception($"Impossible d'instancier la classe '{typeStructure.FullName}' ({methodAccessEx.GetType().FullName}) : {methodAccessEx.Message}", methodAccessEx);
            }
            catch (Exception ex)
            {
                throw new HL7Exception($"Impossible d'instancier la classe '{typeStructure.FullName}' ({ex.GetType().FullName}) : {ex.Message}", ex);
            }

            return newStruct;
        }
    }
}
