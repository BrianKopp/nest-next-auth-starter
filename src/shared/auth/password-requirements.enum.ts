export enum PasswordRequirements {
  LENGTH = 'must be between 8 and 24 characters',
  REQUIRE_UPPERCASE = 'must include one uppercase letter',
  REQUIRE_LOWERCASE = 'must include one lowercase letter',
  REQUIRE_SYMBOL = 'must include at least one symbol within, e.g. ! @ # ?',
  REQUIRE_NUMBER = 'must include at least one number',
}

export const AllPasswordRequirements = [
  PasswordRequirements.LENGTH,
  PasswordRequirements.REQUIRE_UPPERCASE,
  PasswordRequirements.REQUIRE_LOWERCASE,
  PasswordRequirements.REQUIRE_SYMBOL,
  PasswordRequirements.REQUIRE_NUMBER,
];

export const PasswordRequirementRegexes = {
  [PasswordRequirements.LENGTH]: /^.{8,24}$/,
  [PasswordRequirements.REQUIRE_UPPERCASE]: /^.*[A-Z]+.*$/,
  [PasswordRequirements.REQUIRE_LOWERCASE]: /^.*[a-z]+.*$/,
  [PasswordRequirements.REQUIRE_SYMBOL]: /^.*[!@#$%^&*]+.*$/,
  [PasswordRequirements.REQUIRE_NUMBER]: /^.*[0-9]+.*$/,
};
