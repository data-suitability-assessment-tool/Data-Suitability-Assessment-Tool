// src/types/assessment.ts
export interface AssessmentData {
    ethicsPrinciples: Record<string, string>;
    qualityDimensions: Record<string, number>;
    results: {
      ethicsPass: boolean;
      qualityPass: boolean;
      overallPass: boolean;
      totalQualityScore: number;
      date: string;
      part1Message: string;
    };
  }
  
  export interface EthicsPrincipleItem {
    id: string;
    element: string;
    explanation: string;
    criteria: string;
  }
  
  export interface QualityDimensionItem {
    id: string;
    element: string;
    definition: string;
    criteria: string[];
    maxScore: number;
  }
  
  export const ETHICS_PRINCIPLES: EthicsPrincipleItem[] = [
    {
      id: "1",
      element: "Benefit to Canadians",
      explanation: "The information acquired and utilized must provide a clear and easily communicated benefit to Canadians. The data must support Canada's reporting on the Sustainable Development Goals (SDGs) by enabling the measurement of an unreported indicator or by providing data allowing for more granular reporting of a reported indicator.",
      criteria: "Does the information provide a clear benefit to Canadians?"
    },
    {
      id: "2",
      element: "Fairness and do no harm",
      explanation: "If the disseminated data include potentially sensitive topics, it is important to have a plan in place to alleviate any potential harm, unfairness or risk of amplifying stereotypes and stigma on groups featured in the data. Additionally, the appropriate partners should be consulted throughout the process to discuss any potential fairness and harm issues. The data must use the appropriate terminology and categories to describe the various population groups featured.",
      criteria: "Are potentially sensitive topics handled in a way that ensures fairness and causes no harm?"
    },
    {
      id: "3",
      element: "Transparency and accountability",
      explanation: "The methods used to transform the information to produce statistics must be communicated clearly to ensure transparency. The methodology used must be documented and continually monitored alongside its outputs to ensure continued robustness and relevance for the reporting.",
      criteria: "Are the methods used monitored and communicated regularly alongside its outputs?"
    },
    {
      id: "4",
      element: "Privacy",
      explanation: "Protecting the privacy of respondents throughout the process is critical. Some examples of methods that can help include limiting access to confidential information to a need to know basis while limiting collection to strictly necessary information from fully consenting individuals. The privacy of respondents must be maintained during all the steps of the statistical process.",
      criteria: "Is the privacy of respondents respected?"
    },
    {
      id: "5",
      element: "Confidentiality",
      explanation: "Ensuring that the data does not contain confidential information, such as personal information or identifying characteristics is critical to ensuring confidentiality. The data used to measure and report on Canada's progress must not include any confidential information. Furthermore, it must be impossible to connect individuals to the disseminated data.",
      criteria: "Is confidentiality maintained?"
    }
  ];
  
  export const QUALITY_DIMENSIONS: QualityDimensionItem[] = [
    {
      id: "1",
      element: "Accuracy and reliability",
      definition: "The accuracy of statistical information is the degree to which the information correctly describes the phenomena it was designed to measure. Reliability reflects the degree to which statistical information correctly describes the phenomena it was designed to measure consistently over time. The data must accurately and reliably measure Canada's progress for a selected SDG indicator over time.",
      criteria: [
        "There are no or few missing values for the most important statistics",
        "There are established verification rules for the data",
        "Documented quality assurance processes were followed"
      ],
      maxScore: 3
    },
    {
      id: "2",
      element: "Timeliness and punctuality",
      definition: "The timeliness of statistical information refers to the delay between the information reference period and the date on which the information becomes available and punctuality refers to the difference between planned and actual availability. The data must provide a measure of Canada's progress on the SDGs at planned and regular intervals through time covering the period of the Agenda 2030.",
      criteria: [
        "The data is available in a timely manner",
        "The data is released at regular intervals",
        "The data is published on planned dates"
      ],
      maxScore: 3
    },
    {
      id: "3",
      element: "Accessibility and clarity",
      definition: "The accessibility and clarity of data and supporting information refer to the ease with which users can learn that the information exists, find it, view it and use it. The data and its supporting information must be easily accessible and harvested to facilitate its use in Canada's reporting on the SDGs.",
      criteria: [
        "The data and supporting information are easily accessible",
        "The data and supporting information are provided in an easy-to-use format"
      ],
      maxScore: 3
    },
    {
      id: "4",
      element: "Interpretability",
      definition: "The interpretability of statistical information refers to the availability of supplementary information and metadata needed to interpret the data and possibly reproduce it. This information normally covers the underlying concepts, the reference period of the data, the variables and classifications used, the methodology of the data collection and processing. The data and any relevant information (including the ref period) must be available to support Canada's reporting on the SDGs over the Agenda 2030 (2015-2030).",
      criteria: [
        "A description of the methods used to collect, process and analyze the data is available to users",
        "The definition of all variables, code sets and classifications used is provided to the users",
        "The reference period of the data is well defined and communicated"
      ],
      maxScore: 3
    },
    {
      id: "5",
      element: "Coherence and comparability",
      definition: "The coherence and comparability of statistical information refer to the degree to which it can be reliably combined and compared with other statistical information and over time. The use of common concepts (e.g., terminology, classification, methodology etc.) and standards are critical to ensuring coherence and facilitate its use in Canada's reporting on the SDGs.",
      criteria: [
        "Standard concepts are used",
        "Comparability is maintained over time and across regions",
        "Any inconsistencies or break in the time series are explained"
      ],
      maxScore: 3
    }
  ];