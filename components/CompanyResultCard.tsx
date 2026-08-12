'use client';

import React, { useState } from 'react';
import {
  Building2,
  Users,
  MapPin,
  FileText,
  DollarSign,
  Calendar,
  Copy,
  Check,
  Server,
  Layers,
} from 'lucide-react';
import { CompanyData, formatarMoeda, formatarCNPJ } from '@/lib/cnpj';
import { CipherEffect } from './CipherEffect';
import { soundFx } from '@/lib/audio';

interface CompanyResultCardProps {
  data: CompanyData;
  onNewSearch?: () => void;
}

export const CompanyResultCard: React.FC<CompanyResultCardProps> = ({ data }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const getStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s.includes('ACTIV') || s.includes('ATIVA')) {
      return (
        <span className="px-3 py-1 border-2 border-matrix-green bg-matrix-black text-matrix-green font-bold text-sm matrix-glow flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-matrix-green rounded-full animate-ping" />
          [ STATUS: ATIVA // OK ]
        </span>
      );
    }
    if (s.includes('SUSP') || s.includes('PEND') || s.includes('BAIX')) {
      return (
        <span className="px-3 py-1 border-2 border-matrix-warning bg-matrix-black text-matrix-warning font-bold text-sm matrix-glow-warning flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-matrix-warning rounded-full" />
          [ STATUS: {s} // WARN ]
        </span>
      );
    }
    return (
      <span className="px-3 py-1 border-2 border-matrix-red bg-matrix-black text-matrix-red font-bold text-sm matrix-glow-red flex items-center gap-2">
        <span className="w-2.5 h-2.5 bg-matrix-red rounded-full animate-pulse" />
        [ STATUS: {s || 'INAPTA'} // FAIL ]
      </span>
    );
  };

  const handleCopyJSON = () => {
    soundFx.playBeep();
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="brutalist-card p-4 sm:p-6 mb-6 relative overflow-hidden">
      {/* Faixa Superior com Status e Fonte de Dados */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-matrix-green pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-matrix-green/70 mb-1">
            <Server className="w-3.5 h-3.5" />
            <span>NODE_DATA: {data.fonte_dados || 'DESCONHECIDO'}</span>
            <span>//</span>
            <span>{new Date(data.data_consulta || Date.now()).toLocaleTimeString()}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold uppercase tracking-wider matrix-glow flex items-center gap-3 flex-wrap">
            <CipherEffect text={data.razao_social} />
          </h2>
          {data.nome_fantasia && data.nome_fantasia !== data.razao_social && (
            <p className="text-sm font-mono text-matrix-mint mt-1">
              FANTASIA: <CipherEffect text={data.nome_fantasia} />
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center flex-wrap">
          {getStatusBadge(data.situacao_cadastral)}

          <button
            onClick={handleCopyJSON}
            className="px-3 py-1 border-2 border-matrix-green bg-matrix-black text-matrix-green hover:bg-matrix-green hover:text-matrix-black transition-all text-xs font-mono font-bold flex items-center gap-1.5"
            title="Copiar Payload JSON"
          >
            {copied ? <Check className="w-4 h-4 text-matrix-mint" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '[COPIADO!]' : '[COPIAR_JSON]'}</span>
          </button>
        </div>
      </div>

      {/* Grid de Informações Estruturadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* CNPJ */}
        <div className="p-3 border border-matrix-muted bg-matrix-black">
          <div className="text-xs text-matrix-green/70 font-mono flex items-center gap-1.5 mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>CNPJ_REGISTRO</span>
          </div>
          <p className="text-lg font-bold font-mono text-matrix-green tracking-wider">
            {formatarCNPJ(data.cnpj)}
          </p>
        </div>

        {/* Capital Social */}
        <div className="p-3 border border-matrix-muted bg-matrix-black">
          <div className="text-xs text-matrix-green/70 font-mono flex items-center gap-1.5 mb-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span>CAPITAL_SOCIAL</span>
          </div>
          <p className="text-lg font-bold font-mono text-matrix-mint">
            {formatarMoeda(data.capital_social)}
          </p>
        </div>

        {/* Data Inicio Atividade */}
        <div className="p-3 border border-matrix-muted bg-matrix-black">
          <div className="text-xs text-matrix-green/70 font-mono flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>ABERTURA_EM</span>
          </div>
          <p className="text-base font-bold font-mono text-matrix-green">
            {data.data_inicio_atividade || 'N/A'}
          </p>
        </div>

        {/* Porte / Jurídica */}
        <div className="p-3 border border-matrix-muted bg-matrix-black">
          <div className="text-xs text-matrix-green/70 font-mono flex items-center gap-1.5 mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>PORTE_EMPRESA</span>
          </div>
          <p className="text-base font-bold font-mono text-matrix-green uppercase">
            {data.porte || 'DEMAIS'}
          </p>
        </div>
      </div>

      {/* Endereço & Localização */}
      <div className="p-4 border border-matrix-muted bg-matrix-black mb-6">
        <div className="text-xs text-matrix-green/70 font-mono flex items-center gap-1.5 mb-2 border-b border-matrix-muted/50 pb-1">
          <MapPin className="w-4 h-4 text-matrix-green" />
          <span className="font-bold">ENDEREÇO_SEDE // LOCALIZAÇÃO</span>
        </div>
        <p className="text-sm font-mono text-matrix-green">
          {data.logradouro}, {data.numero} {data.complemento ? `(${data.complemento})` : ''} - {data.bairro}
        </p>
        <p className="text-sm font-mono text-matrix-mint font-bold mt-1">
          {data.municipio} / {data.uf} — CEP: {data.cep}
        </p>
      </div>

      {/* Atividade Econômica (CNAE) */}
      <div className="p-4 border border-matrix-muted bg-matrix-black mb-6">
        <div className="text-xs text-matrix-green/70 font-mono flex items-center gap-1.5 mb-2 border-b border-matrix-muted/50 pb-1">
          <Layers className="w-4 h-4 text-matrix-green" />
          <span className="font-bold">ATIVIDADE_ECONOMICA (CNAE)</span>
        </div>
        
        <div className="mb-3">
          <span className="text-xs font-mono text-matrix-mint font-bold uppercase block mb-1">
            [PRINCIPAL]
          </span>
          <p className="text-sm font-mono text-matrix-green">
            <strong className="text-matrix-mint">CNAE {data.cnae_fiscal_principal.codigo}:</strong>{' '}
            {data.cnae_fiscal_principal.descricao}
          </p>
        </div>

        {data.cnaes_secundarios && data.cnaes_secundarios.length > 0 && (
          <div>
            <span className="text-xs font-mono text-matrix-green/70 uppercase block mb-1">
              [SECUNDÁRIAS ({data.cnaes_secundarios.length})]
            </span>
            <div className="max-h-32 overflow-y-auto pr-2 space-y-1">
              {data.cnaes_secundarios.map((cnae, i) => (
                <p key={i} className="text-xs font-mono text-matrix-green/80">
                  <span className="text-matrix-muted">• CNAE {cnae.codigo}:</span> {cnae.descricao}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* QSA (Quadro de Sócios e Administradores) */}
      <div className="p-4 border border-matrix-muted bg-matrix-black">
        <div className="text-xs text-matrix-green/70 font-mono flex items-center justify-between mb-3 border-b border-matrix-muted/50 pb-1">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-matrix-green" />
            <span className="font-bold">QUADRO_SOCIETARIO (QSA)</span>
          </div>
          <span className="text-xs text-matrix-mint font-bold">
            [{data.qsa ? data.qsa.length : 0} SÓCIOS ENCONTRADOS]
          </span>
        </div>

        {data.qsa && data.qsa.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-matrix-green text-matrix-mint bg-matrix-darkGreen/50">
                  <th className="py-2 px-3">SÓCIO / RAZÃO SOCIAL</th>
                  <th className="py-2 px-3">QUALIFICAÇÃO</th>
                  <th className="py-2 px-3">PAÍS</th>
                </tr>
              </thead>
              <tbody>
                {data.qsa.map((socio, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-matrix-muted/40 hover:bg-matrix-darkGreen/30 transition-colors"
                  >
                    <td className="py-2 px-3 text-matrix-green font-bold uppercase">
                      {socio.nome}
                    </td>
                    <td className="py-2 px-3 text-matrix-mint">
                      {socio.qualificacao}
                    </td>
                    <td className="py-2 px-3 text-matrix-green/70">
                      {socio.pais_origem || 'BRASIL'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs font-mono text-matrix-muted italic py-2">
            Nenhum sócio ou administrador listado publicamente para este CNPJ.
          </p>
        )}
      </div>
    </div>
  );
};
