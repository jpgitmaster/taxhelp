const BIR_VALIDATION_STATUSES = [
    { value: 'Passed', label: 'Passed' },
    { value: 'Failed', label: 'Failed' },
    { value: 'Processing', label: 'Processing' },
]

// The upload modal accepts a single DAT file per validation job.
const BIR_VALIDATION_UPLOAD_EXTENSION = '.dat'

export {
    BIR_VALIDATION_STATUSES,
    BIR_VALIDATION_UPLOAD_EXTENSION
};
