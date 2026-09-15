interface ContactUsObj{
  fullName: string
  email: string
  message: string
}

interface ContactUs{
    contactObj: ContactUsObj
    contactErr: Record<string, string | { value: string; }>
}

export type {
    ContactUs,
    ContactUsObj,
}