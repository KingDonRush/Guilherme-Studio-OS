import type { Command } from "commander";
import { executeCliCommand, globalOptions } from "../../runtime.js";
import type { DomainCommandMap } from "./base.js";

function parseJsonArray(value: string | undefined, label: string): Record<string, unknown>[] {
  if (!value) {
    return [];
  }
  const parsed = JSON.parse(value) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error(`${label} must be a JSON array`);
  }
  return parsed.map((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error(`${label} entries must be JSON objects`);
    }
    return entry as Record<string, unknown>;
  });
}

function requirementsFromFlags(
  requirement: string[] | undefined,
  requirementsJson: string | undefined,
): Record<string, unknown>[] {
  const rich = parseJsonArray(requirementsJson, "requirements");
  if (rich.length > 0) {
    return rich;
  }
  return (requirement ?? []).map((text) => ({ text, type: "explicit" }));
}

export function registerCareerDomainCommands(
  program: Command,
  domainCommands: DomainCommandMap,
): void {
  const career = program.command("career").description("Operate international career pipeline");

  career
    .command("record-strategy")
    .option("--title <title>")
    .requiredOption("--role-family <text...>")
    .option("--employment-type <text...>")
    .option("--geography <text...>")
    .option("--timezone <text>")
    .option("--language <text>")
    .option("--salary <text>")
    .option("--unacceptable <text...>")
    .option("--evidence-map-json <json-array>")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const local = this.opts() as {
        title?: string;
        roleFamily: string[];
        employmentType?: string[];
        geography?: string[];
        timezone?: string;
        language?: string;
        salary?: string;
        unacceptable?: string[];
        evidenceMapJson?: string;
      };
      await executeCliCommand(options, "career.record-strategy", {
        ...(local.title ? { title: local.title } : {}),
        role_families: local.roleFamily,
        employment_types: local.employmentType ?? [],
        geographies: local.geography ?? [],
        ...(local.timezone ? { timezone: local.timezone } : {}),
        ...(local.language ? { language: local.language } : {}),
        ...(local.salary ? { salary_expectation: local.salary } : {}),
        unacceptable_constraints: local.unacceptable ?? [],
        evidence_map: parseJsonArray(local.evidenceMapJson, "evidence_map"),
      });
    });

  career.command("next-actions").action(async function action(this: Command) {
    const options = globalOptions(this);
    await executeCliCommand(options, "career.next-actions", {});
  });

  domainCommands
    .get("application")
    ?.command("register-opportunity")
    .requiredOption("--title <title>")
    .requiredOption("--source <url>")
    .option("--organization <id>")
    .option("--role-title <title>")
    .option("--role-family <family>")
    .option("--employment-type <type>")
    .option("--geography <text>")
    .option("--timezone <text>")
    .option("--language <text>")
    .option("--compensation <text>")
    .option("--requirement <text...>")
    .option("--requirements-json <json-array>")
    .option("--deadline-at <iso-date>")
    .option("--contact-name <name>")
    .option("--contact-url <url>")
    .option("--source-freshness <freshness>")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const local = this.opts() as {
        title: string;
        source: string;
        organization?: string;
        roleTitle?: string;
        roleFamily?: string;
        employmentType?: string;
        geography?: string;
        timezone?: string;
        language?: string;
        compensation?: string;
        requirement?: string[];
        requirementsJson?: string;
        deadlineAt?: string;
        contactName?: string;
        contactUrl?: string;
        sourceFreshness?: string;
      };
      await executeCliCommand(options, "application.register-opportunity", {
        title: local.title,
        source_url: local.source,
        ...(local.organization ? { organization_id: local.organization } : {}),
        ...(local.roleTitle ? { role_title: local.roleTitle } : {}),
        ...(local.roleFamily ? { role_family: local.roleFamily } : {}),
        ...(local.employmentType ? { employment_type: local.employmentType } : {}),
        ...(local.geography ? { geography: local.geography } : {}),
        ...(local.timezone ? { timezone: local.timezone } : {}),
        ...(local.language ? { language: local.language } : {}),
        ...(local.compensation ? { compensation: local.compensation } : {}),
        requirements: requirementsFromFlags(local.requirement, local.requirementsJson),
        ...(local.deadlineAt ? { deadline_at: local.deadlineAt } : {}),
        ...(local.contactName ? { contact_name: local.contactName } : {}),
        ...(local.contactUrl ? { contact_url: local.contactUrl } : {}),
        ...(local.sourceFreshness ? { source_freshness: local.sourceFreshness } : {}),
      });
    });

  domainCommands
    .get("application")
    ?.command("review-duplicates")
    .option("--source <url>")
    .option("--title <title>")
    .option("--organization <id>")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const local = this.opts() as { source?: string; title?: string; organization?: string };
      await executeCliCommand(options, "application.review-duplicates", {
        ...(local.source ? { source_url: local.source } : {}),
        ...(local.title ? { title: local.title } : {}),
        ...(local.organization ? { organization_id: local.organization } : {}),
      });
    });

  domainCommands
    .get("application")
    ?.command("analyze-fit")
    .argument("<application-id>")
    .option("--signal <text...>")
    .option("--evidence <id...>")
    .option("--rationale <text>")
    .action(async function action(this: Command, applicationId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { signal?: string[]; evidence?: string[]; rationale?: string };
      await executeCliCommand(
        options,
        "application.analyze-fit",
        {
          application_id: applicationId,
          verified_signals: local.signal ?? [],
          evidence_ids: local.evidence ?? [],
          ...(local.rationale ? { rationale: local.rationale } : {}),
        },
        applicationId,
      );
    });

  domainCommands
    .get("application")
    ?.command("prepare")
    .requiredOption("--title <title>")
    .requiredOption("--source <url>")
    .option("--organization <id>")
    .option("--role-family <family>")
    .option("--resume <ref>")
    .option("--cover <text>")
    .option("--portfolio <url...>")
    .option("--repository <id...>")
    .option("--evidence <id...>")
    .option("--answers-json <json-array>")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const local = this.opts() as {
        title: string;
        source: string;
        organization?: string;
        roleFamily?: string;
        resume?: string;
        cover?: string;
        portfolio?: string[];
        repository?: string[];
        evidence?: string[];
        answersJson?: string;
      };
      await executeCliCommand(options, "application.prepare", {
        title: local.title,
        source_url: local.source,
        ...(local.organization ? { organization_id: local.organization } : {}),
        ...(local.roleFamily ? { role_family: local.roleFamily } : {}),
        ...(local.resume ? { resume_ref: local.resume } : {}),
        ...(local.cover ? { cover_message: local.cover } : {}),
        portfolio_links: local.portfolio ?? [],
        repository_ids: local.repository ?? [],
        evidence_ids: local.evidence ?? [],
        answers: parseJsonArray(local.answersJson, "answers"),
      });
    });

  domainCommands
    .get("application")
    ?.command("validate")
    .argument("<application-id>")
    .action(async function action(this: Command, applicationId: string) {
      const options = globalOptions(this);
      await executeCliCommand(
        options,
        "application.validate",
        { application_id: applicationId },
        applicationId,
      );
    });

  domainCommands
    .get("application")
    ?.command("prepare-submission")
    .argument("<application-id>")
    .option("--channel <channel>")
    .option("--message <text>")
    .action(async function action(this: Command, applicationId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { channel?: string; message?: string };
      await executeCliCommand(
        options,
        "application.prepare-submission",
        {
          application_id: applicationId,
          ...(local.channel ? { channel: local.channel } : {}),
          ...(local.message ? { message: local.message } : {}),
        },
        applicationId,
      );
    });

  domainCommands
    .get("application")
    ?.command("record-submission")
    .argument("<application-id>")
    .requiredOption("--prepared-action <id>")
    .option("--submitted-at <iso-date>")
    .option("--reference <text>")
    .action(async function action(this: Command, applicationId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        preparedAction: string;
        submittedAt?: string;
        reference?: string;
      };
      await executeCliCommand(
        options,
        "application.record-submission",
        {
          application_id: applicationId,
          prepared_action_id: local.preparedAction,
          ...(local.submittedAt ? { submitted_at: local.submittedAt } : {}),
          ...(local.reference ? { reference: local.reference } : {}),
        },
        applicationId,
      );
    });

  domainCommands
    .get("application")
    ?.command("follow-up")
    .argument("<application-id>")
    .requiredOption("--at <iso-date>")
    .option("--channel <channel>")
    .option("--message <text>")
    .option("--policy <text>")
    .action(async function action(this: Command, applicationId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        at: string;
        channel?: string;
        message?: string;
        policy?: string;
      };
      await executeCliCommand(
        options,
        "application.follow-up",
        {
          application_id: applicationId,
          follow_up_at: local.at,
          ...(local.channel ? { channel: local.channel } : {}),
          ...(local.message ? { message: local.message } : {}),
          ...(local.policy ? { policy: local.policy } : {}),
        },
        applicationId,
      );
    });

  domainCommands
    .get("application")
    ?.command("record-interview")
    .argument("<application-id>")
    .requiredOption("--at <iso-date>")
    .option("--notes <text>")
    .action(async function action(this: Command, applicationId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { at: string; notes?: string };
      await executeCliCommand(
        options,
        "application.record-interview",
        {
          application_id: applicationId,
          interview_at: local.at,
          ...(local.notes ? { notes: local.notes } : {}),
        },
        applicationId,
      );
    });

  domainCommands
    .get("application")
    ?.command("interview-context")
    .argument("<application-id>")
    .option("--next-action <text>")
    .action(async function action(this: Command, applicationId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { nextAction?: string };
      await executeCliCommand(
        options,
        "application.interview-context",
        {
          application_id: applicationId,
          ...(local.nextAction ? { next_action: local.nextAction } : {}),
        },
        applicationId,
      );
    });

  domainCommands
    .get("application")
    ?.command("record-outcome")
    .argument("<application-id>")
    .requiredOption("--outcome <outcome>")
    .option("--reason <text>")
    .option("--learning <text>")
    .option("--sample-size <count>")
    .option("--evidence <id...>")
    .action(async function action(this: Command, applicationId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        outcome: string;
        reason?: string;
        learning?: string;
        sampleSize?: string;
        evidence?: string[];
      };
      await executeCliCommand(
        options,
        "application.record-outcome",
        {
          application_id: applicationId,
          outcome: local.outcome,
          ...(local.reason ? { reason: local.reason } : {}),
          ...(local.learning ? { learning_notes: local.learning } : {}),
          ...(local.sampleSize ? { sample_size: Number.parseInt(local.sampleSize, 10) } : {}),
          evidence_ids: local.evidence ?? [],
        },
        applicationId,
      );
    });
}
