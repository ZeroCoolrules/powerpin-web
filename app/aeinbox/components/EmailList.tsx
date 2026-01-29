function EmailList() { 

  return ( 

    <div className="w-96 border-r p-4"> 

      <h2>Inbox</h2> 

 

      <div className="mt-4 space-y-2"> 

        <EmailRow /> 

        <EmailRow /> 

        <EmailRow /> 

      </div> 

    </div> 

  ) 

} 