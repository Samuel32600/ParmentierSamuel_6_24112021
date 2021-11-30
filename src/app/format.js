export const formatDate = (dateStr) => {

//--------------------------  
//-----Bug report -Bils-----
//--------------------------

  if (!dateStr) {
    return ''
  }

  //define const for day, month and year
  const date = new Date(dateStr)
  const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('fr', { month: 'numeric' }).format(date)
  const da = new Intl.DateTimeFormat('fr', { day: 'numeric' }).format(date)
  
  return `${da}-${mo}-${ye}`
}
 
export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refused"
  }
}