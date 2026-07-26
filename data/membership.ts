export const membershipContent = {
  annualDues: 30,
  activeMember: {
    ageMaximum: 40,
    ageMinimum: 18,
    geography: "Van Zandt County or an adjoining county",
    requirements: [
      "Be a United States citizen or have a currently pending application for citizenship.",
      "Be a registered voter.",
      "Maintain a primary residence in Van Zandt County or an adjoining county.",
      "Be between 18 and 40 years old, inclusive.",
      "Pay annual NETYR dues.",
    ],
    votingRights:
      "Only Active Members maintain the right to vote in organization affairs.",
  },
  classifications: [
    {
      name: "Active Member",
      description:
        "Voting membership for eligible people ages 18 through 40 who meet the citizenship, voter-registration, geography, and dues requirements.",
    },
    {
      name: "Associate Member",
      description:
        "Participation for people who do not qualify for Active Membership. Associate Members do not vote or hold office.",
    },
    {
      name: "Contributing Member",
      description:
        "A non-voting supporting classification recognized by the NETYR governing document.",
    },
    {
      name: "Honorary Member",
      description:
        "A distinction granted by an affirmative vote under the requirements in the NETYR governing document.",
    },
  ],
} as const;
