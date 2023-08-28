export function handleAssertionError(errorMessage) {
    if (errorMessage.includes("User has already exists")) {
      return 'User has already Exists';
    } else if (errorMessage.includes("You already voted")) {
      return 'You already voted';
    } else if (errorMessage.includes("You aren't have authority")){
      return "You aren't have authority";
    } else {
      return "else"
    }
  }
