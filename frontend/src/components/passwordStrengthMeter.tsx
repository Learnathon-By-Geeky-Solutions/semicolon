import { Check, X } from 'lucide-react';

export const PasswordCriteria : React.FC<{password: string}> = ({password}) => {
  const criteria = [
    { label: "At Least 6 Characters", met: password.length >= 6 },
    { label: "Contains Uppercase Letter", met: (/[A-Z]/g).test(password) },
    { label: "Contains Lowercase Letter", met: (/[a-z]/g).test(password) },
    { label: "Contains Number", met: (/\d/g).test(password) },
    { label: "Contains Special Character", met: (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g).test(password) },
  ];

  return(
    <div className="mt-2 space-y-1">
        {criteria.map(({label, met}) => (
          <div key={label} className="flex items-center text-xs">
            {met ? (
              <Check className="w-4 h-4 text-green-500 mr-2" />
            ) : (
              <X className="w-4 h-4 text-gray-500 mr-2" />
            )}
            <span className={ met ? "text-green-500" : "text-gray-500"}>{label}</span>
          </div>
        ))}
    </div>
  )
}

const PasswordStrengthMeter = ({password} : {password: string}) => {
    const getStrength = (pass: string) => {
      let score = 0;
      if(pass.length >= 6) score++;
      if(pass.match(/[A-Z]/g) && pass.match(/[a-z]/g)) score++;
      if(pass.match(/\d/g)) score++;
      if(pass.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g)) score++;
      return score;
    }

    const strength = getStrength(password);

    const strengthText = ["Very Weak", "Weak", "Moderate", "Strong", "Very Strong"];

    const getStrengthText = (strength: number) => {
      if(strength >= 4) return strengthText[4];
      if(strength >= 3) return strengthText[3];
      if(strength >= 2) return strengthText[2];
      if(strength >= 1) return strengthText[1];
      return strengthText[0];
    }

    const getColor = (strength: number) => {
      if(strength >= 4) return "bg-green-500";
      if(strength >= 3) return "bg-yellow-500";
      if(strength >= 2) return "bg-yellow-500";
      if(strength >= 1) return "bg-red-500";
      return "bg-gray-500";
    }

  return (
    <div className='mt-2'>
        <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500">Password Strength</span>
            <br/>
            <span className={`text-xs font-semibold text-gray-500`}>{getStrengthText(strength)}</span>
        </div>

        <div className='flex space-x-1'>
            {Array.from({ length: 4 }, (_, index) => (
                <div 
                    key={`strength-bar-${index}`} className={`w-1/4 h-1 rounded-full  transition-colors duration-300
                        ${index < strength ? getColor(strength) : "bg-gray-600"}`}
                />
            ))}
        </div>

        <PasswordCriteria password={password}/>
    </div>
  )
}

export default PasswordStrengthMeter