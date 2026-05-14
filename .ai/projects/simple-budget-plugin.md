# Project Dossier: simple-budget-plugin

## Source

GitHub: `https://github.com/KingDonRush/simple-budget-plugin`

Local target: `wordpress/wp-content/plugins/simple-budget-plugin`

## Value Signal

This is the simplicity project:
- solves a real business workflow;
- keeps Elementor interface creation intact;
- uses dynamic metadata from CPTs;
- creates a lightweight quote/cart flow;
- sends a prebuilt budget message through WhatsApp.

## Current Understanding

The exact stopping point is uncertain. Desired improvement: make destination and
message flow more configurable. WhatsApp should not be the only channel.

## Polish Direction

1. Audit current code and feature state.
2. Define two modes:
   - CSS hook mode for compatibility with existing Elementor buttons;
   - optional Elementor widget mode for explicit UI.
3. Add configurable destinations:
   - WhatsApp;
   - email;
   - Telegram;
   - custom webhook or URL template.
4. Reuse a small style library or design-token approach without bloating the
   plugin.
5. Add admin settings with safe defaults.
6. Add docs and a demo flow.

## Portfolio Case Study Angle

"I turned a messy quote-request journey into a lightweight Elementor-compatible
plugin that lets site owners collect product budgets without replacing their
existing design workflow."
