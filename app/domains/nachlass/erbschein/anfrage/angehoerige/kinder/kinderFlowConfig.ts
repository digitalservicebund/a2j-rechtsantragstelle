import { type TransitionConfigMap } from "~/services/flow/newFlowEngine/types";
import { allDescendantsDead } from "~/domains/nachlass/erbschein/shared/erbfolgeHelpers";
import { collectMissingChildrenNames } from "~/domains/nachlass/erbschein/shared/missingChildren";
import { type NachlassErbscheinAnfragePages } from "~/domains/nachlass/erbschein/anfrage/pages";
import { kinderRequireFurtherGenerations } from "~/domains/nachlass/erbschein/shared/calculateInheritance";

export const kinderFlowConfig = {
  hatteKinder: [
    {
      guard: ({ hatteKinder }) => hatteKinder === "yes",
      target: "kind1Summary",
    },
    {
      target: "grundbesitz",
    },
  ],
  kinderFehlen: null,
  kind1Summary: [
    { target: "kind1Name", type: "addArrayItem" },
    {
      // Checked first: a depth-5 dead person with hatteKinder="yes" can never
      // have kinder filled in (no depth-6 UI exists), so it would otherwise
      // always look like a "missing children" case below.
      target: "angehoerigeOverview",
      guard: kinderRequireFurtherGenerations,
    },
    {
      // Wrapping the deceased as the root of the tree catches both shapes at
      // once: hatteKinder="yes" with an empty kinder array (nobody added at
      // all), and any individual kind further down with the same problem.
      target: "kinderFehlen",
      guard: ({
        verstorbeneVorname,
        verstorbeneNachname,
        hatteKinder,
        kinder,
      }) =>
        collectMissingChildrenNames([
          {
            vorname: verstorbeneVorname,
            nachname: verstorbeneNachname,
            isAlive: "no",
            hatteKinder,
            kinder,
          },
        ]).length > 0,
    },
    {
      target: null, // FIXME: redirect to elternteil summary page
      guard: ({ kinder }) =>
        !!kinder && kinder.length > 0 && kinder.every(allDescendantsDead),
    },
    { target: "grundbesitz" },
  ],
  kind1Name: "kind1Geburtsdatum",
  kind1Geburtsdatum: "kind1Provenance",
  kind1Provenance: "kind1IsAlive",
  kind1IsAlive: [
    {
      guard: ({ kinder, pageData }) => {
        const arrayIndexes = pageData?.arrayIndexes;
        if (!kinder || !arrayIndexes || arrayIndexes.length < 1) return false;
        if (kinder.length <= arrayIndexes[0]) return false;
        return kinder[arrayIndexes[0]].isAlive === "no";
      },
      target: "kind1Sterbedatum",
    },
    {
      target: "kind1Address",
    },
  ],
  kind1Address: "kind1Summary",
  kind1Sterbedatum: "kind1HatteKinder",
  kind1HatteKinder: [
    {
      target: null, // FIXME: go to deeper kind
      type: "addArrayItem",
      guard: ({ kinder, pageData }) => {
        const arrayIndexes = pageData?.arrayIndexes;
        if (!kinder || !arrayIndexes || arrayIndexes.length < 1) return false;
        if (kinder.length <= arrayIndexes[0]) return false;
        const kind = kinder[arrayIndexes[0]];
        if (kind.isAlive !== "no") return false;
        return kind.hatteKinder === "yes";
      },
    },
    { target: "kind1Summary", guard: () => true },
  ],
  // kind2Name: [
  //   {
  //     target: "kind2HatteKinder",
  //     guard: ({ kinder, pageData }) => {
  //       const arrayIndexes = pageData?.arrayIndexes;
  //       if (!kinder || !arrayIndexes || arrayIndexes.length < 2) return false;
  //       const kind1 = kinder[arrayIndexes[0]];
  //       if (kind1.isAlive !== "no" || kind1.hatteKinder !== "yes") return false;
  //       if (!kind1.kinder || kind1.kinder.length <= arrayIndexes[1])
  //         return false;
  //       return kind1.kinder[arrayIndexes[1]].isAlive === "no";
  //     },
  //   },
  //   { target: "kind1Summary", guard: () => true },
  // ],
  // kind2HatteKinder: [
  //   {
  //     target: "kind3Name",
  //     type: "addArrayItem",
  //     guard: ({ kinder, pageData }) => {
  //       const arrayIndexes = pageData?.arrayIndexes;
  //       if (!kinder || !arrayIndexes || arrayIndexes.length < 2) return false;
  //       const kind1 = kinder[arrayIndexes[0]];
  //       if (kind1.isAlive !== "no" || kind1.hatteKinder !== "yes") return false;
  //       if (!kind1.kinder || kind1.kinder.length <= arrayIndexes[1])
  //         return false;
  //       const kind2 = kind1.kinder[arrayIndexes[1]];
  //       if (kind2.isAlive !== "no") return false;
  //       return kind2.hatteKinder === "yes";
  //     },
  //   },
  //   { target: "kind1Summary", guard: () => true },
  // ],
  // kind3Name: [
  //   {
  //     target: "kind3HatteKinder",
  //     guard: ({ kinder, pageData }) => {
  //       const arrayIndexes = pageData?.arrayIndexes;
  //       if (!kinder || !arrayIndexes || arrayIndexes.length < 3) return false;
  //       const kind1 = kinder[arrayIndexes[0]];
  //       if (kind1.isAlive !== "no" || kind1.hatteKinder !== "yes") return false;
  //       if (!kind1.kinder || kind1.kinder.length <= arrayIndexes[1])
  //         return false;
  //       const kind2 = kind1.kinder[arrayIndexes[1]];
  //       if (kind2.isAlive !== "no" || kind2.hatteKinder !== "yes") return false;
  //       if (!kind2.kinder || kind2.kinder.length <= arrayIndexes[2])
  //         return false;
  //       return kind2.kinder[arrayIndexes[2]].isAlive === "no";
  //     },
  //   },
  //   { target: "kind1Summary", guard: () => true },
  // ],
  // kind3HatteKinder: [
  //   {
  //     target: "kind4Name",
  //     type: "addArrayItem",
  //     guard: ({ kinder, pageData }) => {
  //       const arrayIndexes = pageData?.arrayIndexes;
  //       if (!kinder || !arrayIndexes || arrayIndexes.length < 3) return false;
  //       const kind1 = kinder[arrayIndexes[0]];
  //       if (kind1.isAlive !== "no" || kind1.hatteKinder !== "yes") return false;
  //       if (!kind1.kinder || kind1.kinder.length <= arrayIndexes[1])
  //         return false;
  //       const kind2 = kind1.kinder[arrayIndexes[1]];
  //       if (kind2.isAlive !== "no" || kind2.hatteKinder !== "yes") return false;
  //       if (!kind2.kinder || kind2.kinder.length <= arrayIndexes[2])
  //         return false;
  //       const kind3 = kind2.kinder[arrayIndexes[2]];
  //       if (kind3.isAlive !== "no") return false;
  //       return kind3.hatteKinder === "yes";
  //     },
  //   },
  //   { target: "kind1Summary", guard: () => true },
  // ],
  // kind4Name: [
  //   {
  //     target: "kind4HatteKinder",
  //     guard: ({ kinder, pageData }) => {
  //       const arrayIndexes = pageData?.arrayIndexes;
  //       if (!kinder || !arrayIndexes || arrayIndexes.length < 4) return false;
  //       const kind1 = kinder[arrayIndexes[0]];
  //       if (kind1.isAlive !== "no" || kind1.hatteKinder !== "yes") return false;
  //       if (!kind1.kinder || kind1.kinder.length <= arrayIndexes[1])
  //         return false;
  //       const kind2 = kind1.kinder[arrayIndexes[1]];
  //       if (kind2.isAlive !== "no" || kind2.hatteKinder !== "yes") return false;
  //       if (!kind2.kinder || kind2.kinder.length <= arrayIndexes[2])
  //         return false;
  //       const kind3 = kind2.kinder[arrayIndexes[2]];
  //       if (kind3.isAlive !== "no" || kind3.hatteKinder !== "yes") return false;
  //       if (!kind3.kinder || kind3.kinder.length <= arrayIndexes[3])
  //         return false;
  //       return kind3.kinder[arrayIndexes[3]].isAlive === "no";
  //     },
  //   },
  //   { target: "kind1Summary", guard: () => true },
  // ],
  // kind4HatteKinder: [
  //   {
  //     target: "kind5Name",
  //     type: "addArrayItem",
  //     guard: ({ kinder, pageData }) => {
  //       const arrayIndexes = pageData?.arrayIndexes;
  //       if (!kinder || !arrayIndexes || arrayIndexes.length < 4) return false;
  //       const kind1 = kinder[arrayIndexes[0]];
  //       if (kind1.isAlive !== "no" || kind1.hatteKinder !== "yes") return false;
  //       if (!kind1.kinder || kind1.kinder.length <= arrayIndexes[1])
  //         return false;
  //       const kind2 = kind1.kinder[arrayIndexes[1]];
  //       if (kind2.isAlive !== "no" || kind2.hatteKinder !== "yes") return false;
  //       if (!kind2.kinder || kind2.kinder.length <= arrayIndexes[2])
  //         return false;
  //       const kind3 = kind2.kinder[arrayIndexes[2]];
  //       if (kind3.isAlive !== "no" || kind3.hatteKinder !== "yes") return false;
  //       if (!kind3.kinder || kind3.kinder.length <= arrayIndexes[3])
  //         return false;
  //       const kind4 = kind3.kinder[arrayIndexes[3]];
  //       if (kind4.isAlive !== "no") return false;
  //       return kind4.hatteKinder === "yes";
  //     },
  //   },
  //   { target: "kind1Summary", guard: () => true },
  // ],
  // kind5Name: [
  //   {
  //     target: "kind5HatteKinder",
  //     guard: ({ kinder, pageData }) => {
  //       const arrayIndexes = pageData?.arrayIndexes;
  //       if (!kinder || !arrayIndexes || arrayIndexes.length < 5) return false;
  //       const kind1 = kinder[arrayIndexes[0]];
  //       if (kind1.isAlive !== "no" || kind1.hatteKinder !== "yes") return false;
  //       if (!kind1.kinder || kind1.kinder.length <= arrayIndexes[1])
  //         return false;
  //       const kind2 = kind1.kinder[arrayIndexes[1]];
  //       if (kind2.isAlive !== "no" || kind2.hatteKinder !== "yes") return false;
  //       if (!kind2.kinder || kind2.kinder.length <= arrayIndexes[2])
  //         return false;
  //       const kind3 = kind2.kinder[arrayIndexes[2]];
  //       if (kind3.isAlive !== "no" || kind3.hatteKinder !== "yes") return false;
  //       if (!kind3.kinder || kind3.kinder.length <= arrayIndexes[3])
  //         return false;
  //       const kind4 = kind3.kinder[arrayIndexes[3]];
  //       if (kind4.isAlive !== "no" || kind4.hatteKinder !== "yes") return false;
  //       if (!kind4.kinder || kind4.kinder.length <= arrayIndexes[4])
  //         return false;
  //       return kind4.kinder[arrayIndexes[4]].isAlive === "no";
  //     },
  //   },
  //   { target: "kind1Summary", guard: () => true },
  // ],
  // kind5HatteKinder: [
  //   {
  //     target: null, // FIXME: move to "weitereAngehoerige"
  //     guard: ({ kinder, pageData }) => {
  //       const arrayIndexes = pageData?.arrayIndexes;
  //       if (!kinder || !arrayIndexes || arrayIndexes.length < 5) return false;
  //       const kind1 = kinder[arrayIndexes[0]];
  //       if (kind1.isAlive !== "no" || kind1.hatteKinder !== "yes") return false;
  //       if (!kind1.kinder || kind1.kinder.length <= arrayIndexes[1])
  //         return false;
  //       const kind2 = kind1.kinder[arrayIndexes[1]];
  //       if (kind2.isAlive !== "no" || kind2.hatteKinder !== "yes") return false;
  //       if (!kind2.kinder || kind2.kinder.length <= arrayIndexes[2])
  //         return false;
  //       const kind3 = kind2.kinder[arrayIndexes[2]];
  //       if (kind3.isAlive !== "no" || kind3.hatteKinder !== "yes") return false;
  //       if (!kind3.kinder || kind3.kinder.length <= arrayIndexes[3])
  //         return false;
  //       const kind4 = kind3.kinder[arrayIndexes[3]];
  //       if (kind4.isAlive !== "no" || kind4.hatteKinder !== "yes") return false;
  //       if (!kind4.kinder || kind4.kinder.length <= arrayIndexes[4])
  //         return false;
  //       const kind5 = kind4.kinder[arrayIndexes[4]];
  //       if (kind5.isAlive !== "no") return false;
  //       return kind5.hatteKinder === "yes";
  //     },
  //   },
  //   { target: "kind1Summary", guard: () => true },
  // ],
} satisfies Partial<TransitionConfigMap<NachlassErbscheinAnfragePages>>;
