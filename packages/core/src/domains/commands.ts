import type { StudioContext } from "../context.js";
import { AgentsDomainService } from "./agents.js";
import { DomainServiceBase } from "./base.js";
import { CareerDomainService } from "./career.js";
import { CrmDomainService } from "./crm.js";
import { DeliveryDomainService } from "./delivery.js";
import { EvidenceDomainService } from "./evidence.js";
import { FinanceDomainService } from "./finance.js";
import { GovernanceDomainService } from "./governance.js";
import { MarketingDomainService } from "./marketing.js";
import { PortfolioDomainService } from "./portfolio.js";
import { ProductsDomainService } from "./products.js";
import { SalesDomainService } from "./sales.js";

export class DomainCommandService extends DomainServiceBase {
  readonly crm: CrmDomainService;
  readonly sales: SalesDomainService;
  readonly delivery: DeliveryDomainService;
  readonly evidence: EvidenceDomainService;
  readonly products: ProductsDomainService;
  readonly portfolio: PortfolioDomainService;
  readonly marketing: MarketingDomainService;
  readonly finance: FinanceDomainService;
  readonly agents: AgentsDomainService;
  readonly career: CareerDomainService;
  readonly governance: GovernanceDomainService;

  constructor(context: StudioContext) {
    super(context);
    this.crm = new CrmDomainService(context);
    this.sales = new SalesDomainService(context);
    this.delivery = new DeliveryDomainService(context);
    this.evidence = new EvidenceDomainService(context);
    this.products = new ProductsDomainService(context);
    this.portfolio = new PortfolioDomainService(context);
    this.marketing = new MarketingDomainService(context);
    this.finance = new FinanceDomainService(context);
    this.agents = new AgentsDomainService(context);
    this.career = new CareerDomainService(context);
    this.governance = new GovernanceDomainService(context);
  }

  reviewDuplicates(
    ...args: Parameters<CrmDomainService["reviewDuplicates"]>
  ): ReturnType<CrmDomainService["reviewDuplicates"]> {
    return this.crm.reviewDuplicates(...args);
  }

  qualifyProspect(
    ...args: Parameters<CrmDomainService["qualifyProspect"]>
  ): ReturnType<CrmDomainService["qualifyProspect"]> {
    return this.crm.qualifyProspect(...args);
  }

  prepareCommunication(
    ...args: Parameters<CrmDomainService["prepareCommunication"]>
  ): ReturnType<CrmDomainService["prepareCommunication"]> {
    return this.crm.prepareCommunication(...args);
  }

  prepareProposal(
    ...args: Parameters<SalesDomainService["prepareProposal"]>
  ): ReturnType<SalesDomainService["prepareProposal"]> {
    return this.sales.prepareProposal(...args);
  }

  convertOpportunity(
    ...args: Parameters<SalesDomainService["convertOpportunity"]>
  ): ReturnType<SalesDomainService["convertOpportunity"]> {
    return this.sales.convertOpportunity(...args);
  }

  createEngagementFromOpportunity(
    ...args: Parameters<SalesDomainService["createEngagementFromOpportunity"]>
  ): ReturnType<SalesDomainService["createEngagementFromOpportunity"]> {
    return this.sales.createEngagementFromOpportunity(...args);
  }

  completeDeliverable(
    ...args: Parameters<DeliveryDomainService["completeDeliverable"]>
  ): ReturnType<DeliveryDomainService["completeDeliverable"]> {
    return this.delivery.completeDeliverable(...args);
  }

  registerEvidence(
    ...args: Parameters<EvidenceDomainService["registerEvidence"]>
  ): ReturnType<EvidenceDomainService["registerEvidence"]> {
    return this.evidence.registerEvidence(...args);
  }

  prepareRelease(
    ...args: Parameters<ProductsDomainService["prepareRelease"]>
  ): ReturnType<ProductsDomainService["prepareRelease"]> {
    return this.products.prepareRelease(...args);
  }

  publishRelease(
    ...args: Parameters<ProductsDomainService["publishRelease"]>
  ): ReturnType<ProductsDomainService["publishRelease"]> {
    return this.products.publishRelease(...args);
  }

  registerProjectRepository(
    ...args: Parameters<ProductsDomainService["registerProjectRepository"]>
  ): ReturnType<ProductsDomainService["registerProjectRepository"]> {
    return this.products.registerProjectRepository(...args);
  }

  createPortfolioCaseFromEvidence(
    ...args: Parameters<PortfolioDomainService["createPortfolioCaseFromEvidence"]>
  ): ReturnType<PortfolioDomainService["createPortfolioCaseFromEvidence"]> {
    return this.portfolio.createPortfolioCaseFromEvidence(...args);
  }

  prepareContent(
    ...args: Parameters<MarketingDomainService["prepareContent"]>
  ): ReturnType<MarketingDomainService["prepareContent"]> {
    return this.marketing.prepareContent(...args);
  }

  createContractFromEngagement(
    ...args: Parameters<FinanceDomainService["createContractFromEngagement"]>
  ): ReturnType<FinanceDomainService["createContractFromEngagement"]> {
    return this.finance.createContractFromEngagement(...args);
  }

  createInvoiceForContract(
    ...args: Parameters<FinanceDomainService["createInvoiceForContract"]>
  ): ReturnType<FinanceDomainService["createInvoiceForContract"]> {
    return this.finance.createInvoiceForContract(...args);
  }

  registerCommercialTerms(
    ...args: Parameters<FinanceDomainService["registerCommercialTerms"]>
  ): ReturnType<FinanceDomainService["registerCommercialTerms"]> {
    return this.finance.registerCommercialTerms(...args);
  }

  registerContractDetails(
    ...args: Parameters<FinanceDomainService["registerContractDetails"]>
  ): ReturnType<FinanceDomainService["registerContractDetails"]> {
    return this.finance.registerContractDetails(...args);
  }

  issueInvoice(
    ...args: Parameters<FinanceDomainService["issueInvoice"]>
  ): ReturnType<FinanceDomainService["issueInvoice"]> {
    return this.finance.issueInvoice(...args);
  }

  updateInvoiceLifecycle(
    ...args: Parameters<FinanceDomainService["updateInvoiceLifecycle"]>
  ): ReturnType<FinanceDomainService["updateInvoiceLifecycle"]> {
    return this.finance.updateInvoiceLifecycle(...args);
  }

  recordPaymentForInvoice(
    ...args: Parameters<FinanceDomainService["recordPaymentForInvoice"]>
  ): ReturnType<FinanceDomainService["recordPaymentForInvoice"]> {
    return this.finance.recordPaymentForInvoice(...args);
  }

  confirmPayment(
    ...args: Parameters<FinanceDomainService["confirmPayment"]>
  ): ReturnType<FinanceDomainService["confirmPayment"]> {
    return this.finance.confirmPayment(...args);
  }

  reconcilePayment(
    ...args: Parameters<FinanceDomainService["reconcilePayment"]>
  ): ReturnType<FinanceDomainService["reconcilePayment"]> {
    return this.finance.reconcilePayment(...args);
  }

  preparePaymentReminder(
    ...args: Parameters<FinanceDomainService["preparePaymentReminder"]>
  ): ReturnType<FinanceDomainService["preparePaymentReminder"]> {
    return this.finance.preparePaymentReminder(...args);
  }

  resolveObligations(
    ...args: Parameters<FinanceDomainService["resolveObligations"]>
  ): ReturnType<FinanceDomainService["resolveObligations"]> {
    return this.finance.resolveObligations(...args);
  }

  reconciliationReport(
    ...args: Parameters<FinanceDomainService["reconciliationReport"]>
  ): ReturnType<FinanceDomainService["reconciliationReport"]> {
    return this.finance.reconciliationReport(...args);
  }

  obligationCalendar(
    ...args: Parameters<FinanceDomainService["obligationCalendar"]>
  ): ReturnType<FinanceDomainService["obligationCalendar"]> {
    return this.finance.obligationCalendar(...args);
  }

  calculateEconomicView(
    ...args: Parameters<FinanceDomainService["calculateEconomicView"]>
  ): ReturnType<FinanceDomainService["calculateEconomicView"]> {
    return this.finance.calculateEconomicView(...args);
  }

  createHandoff(
    ...args: Parameters<AgentsDomainService["createHandoff"]>
  ): ReturnType<AgentsDomainService["createHandoff"]> {
    return this.agents.createHandoff(...args);
  }

  startAgentRun(
    ...args: Parameters<AgentsDomainService["startAgentRun"]>
  ): ReturnType<AgentsDomainService["startAgentRun"]> {
    return this.agents.startAgentRun(...args);
  }

  buildContextPack(
    ...args: Parameters<AgentsDomainService["buildContextPack"]>
  ): ReturnType<AgentsDomainService["buildContextPack"]> {
    return this.agents.buildContextPack(...args);
  }

  authorizeAgentRun(
    ...args: Parameters<AgentsDomainService["authorizeAgentRun"]>
  ): ReturnType<AgentsDomainService["authorizeAgentRun"]> {
    return this.agents.authorizeAgentRun(...args);
  }

  recordObservation(
    ...args: Parameters<AgentsDomainService["recordObservation"]>
  ): ReturnType<AgentsDomainService["recordObservation"]> {
    return this.agents.recordObservation(...args);
  }

  recordAgentAction(
    ...args: Parameters<AgentsDomainService["recordAgentAction"]>
  ): ReturnType<AgentsDomainService["recordAgentAction"]> {
    return this.agents.recordAgentAction(...args);
  }

  recordAgentEvidence(
    ...args: Parameters<AgentsDomainService["recordAgentEvidence"]>
  ): ReturnType<AgentsDomainService["recordAgentEvidence"]> {
    return this.agents.recordAgentEvidence(...args);
  }

  completeVerification(
    ...args: Parameters<AgentsDomainService["completeVerification"]>
  ): ReturnType<AgentsDomainService["completeVerification"]> {
    return this.agents.completeVerification(...args);
  }

  createRunHandoff(
    ...args: Parameters<AgentsDomainService["createRunHandoff"]>
  ): ReturnType<AgentsDomainService["createRunHandoff"]> {
    return this.agents.createRunHandoff(...args);
  }

  closeAgentRun(
    ...args: Parameters<AgentsDomainService["closeAgentRun"]>
  ): ReturnType<AgentsDomainService["closeAgentRun"]> {
    return this.agents.closeAgentRun(...args);
  }

  prepareApplication(
    ...args: Parameters<CareerDomainService["prepareApplication"]>
  ): ReturnType<CareerDomainService["prepareApplication"]> {
    return this.career.prepareApplication(...args);
  }

  recordRoleStrategy(
    ...args: Parameters<CareerDomainService["recordRoleStrategy"]>
  ): ReturnType<CareerDomainService["recordRoleStrategy"]> {
    return this.career.recordRoleStrategy(...args);
  }

  registerJobOpportunity(
    ...args: Parameters<CareerDomainService["registerJobOpportunity"]>
  ): ReturnType<CareerDomainService["registerJobOpportunity"]> {
    return this.career.registerJobOpportunity(...args);
  }

  reviewRoleDuplicates(
    ...args: Parameters<CareerDomainService["reviewRoleDuplicates"]>
  ): ReturnType<CareerDomainService["reviewRoleDuplicates"]> {
    return this.career.reviewRoleDuplicates(...args);
  }

  analyzeRoleFit(
    ...args: Parameters<CareerDomainService["analyzeRoleFit"]>
  ): ReturnType<CareerDomainService["analyzeRoleFit"]> {
    return this.career.analyzeRoleFit(...args);
  }

  validateApplication(
    ...args: Parameters<CareerDomainService["validateApplication"]>
  ): ReturnType<CareerDomainService["validateApplication"]> {
    return this.career.validateApplication(...args);
  }

  prepareApplicationSubmission(
    ...args: Parameters<CareerDomainService["prepareSubmission"]>
  ): ReturnType<CareerDomainService["prepareSubmission"]> {
    return this.career.prepareSubmission(...args);
  }

  recordApplicationSubmission(
    ...args: Parameters<CareerDomainService["recordSubmission"]>
  ): ReturnType<CareerDomainService["recordSubmission"]> {
    return this.career.recordSubmission(...args);
  }

  scheduleApplicationFollowUp(
    ...args: Parameters<CareerDomainService["scheduleApplicationFollowUp"]>
  ): ReturnType<CareerDomainService["scheduleApplicationFollowUp"]> {
    return this.career.scheduleApplicationFollowUp(...args);
  }

  recordApplicationInterview(
    ...args: Parameters<CareerDomainService["recordApplicationInterview"]>
  ): ReturnType<CareerDomainService["recordApplicationInterview"]> {
    return this.career.recordApplicationInterview(...args);
  }

  buildInterviewContext(
    ...args: Parameters<CareerDomainService["buildInterviewContext"]>
  ): ReturnType<CareerDomainService["buildInterviewContext"]> {
    return this.career.buildInterviewContext(...args);
  }

  recordApplicationOutcome(
    ...args: Parameters<CareerDomainService["recordOutcome"]>
  ): ReturnType<CareerDomainService["recordOutcome"]> {
    return this.career.recordOutcome(...args);
  }

  resolveCareerNextActions(
    ...args: Parameters<CareerDomainService["resolveCareerNextActions"]>
  ): ReturnType<CareerDomainService["resolveCareerNextActions"]> {
    return this.career.resolveCareerNextActions(...args);
  }

  recordDecision(
    ...args: Parameters<GovernanceDomainService["recordDecision"]>
  ): ReturnType<GovernanceDomainService["recordDecision"]> {
    return this.governance.recordDecision(...args);
  }

  amendDecision(
    ...args: Parameters<GovernanceDomainService["amendDecision"]>
  ): ReturnType<GovernanceDomainService["amendDecision"]> {
    return this.governance.amendDecision(...args);
  }

  routeKnowledge(
    ...args: Parameters<GovernanceDomainService["routeKnowledge"]>
  ): ReturnType<GovernanceDomainService["routeKnowledge"]> {
    return this.governance.routeKnowledge(...args);
  }

  proposeLearningPromotion(
    ...args: Parameters<GovernanceDomainService["proposeLearningPromotion"]>
  ): ReturnType<GovernanceDomainService["proposeLearningPromotion"]> {
    return this.governance.proposeLearningPromotion(...args);
  }
}
