sed -i 's/>To...lovlar Tarixi</>{t("To'\''lovlar Tarixi")}</g' src/pages/staff/kassir.tsx
perl -0777 -pi -e 's/>\s*Kutayotgan Hisoblar\s*</>\n                        {t("Kutayotgan Hisoblar")}\n                    </g' src/pages/staff/kassir.tsx
